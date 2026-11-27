
import os
import sys
import re
import hashlib
from pathlib import Path

from dotenv import load_dotenv
from pinecone import Pinecone
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore

# --------------------------------------------------
# Configuration
# --------------------------------------------------

PROJECT_DIR = Path(__file__).resolve().parent
load_dotenv(PROJECT_DIR / ".env")

API_KEY = os.getenv("PINECONE_API_KEY", "")
INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "rag-qwen-test")

EMBEDDING_MODEL = os.getenv(
    "EMBEDDING_MODEL",
    "sentence-transformers/all-MiniLM-L6-v2",
)

KNOWLEDGE_FILE = PROJECT_DIR / "data" / "knowledge.txt"
EXPECTED_DIMENSION = 384

SCHEME_NAME = os.getenv(
    "SCHEME_NAME",
    "EduAssist Fictional Grant Program (EFGP)",
)

CATEGORY = os.getenv("SCHEME_CATEGORY", "Education")


# --------------------------------------------------
# Text cleaning
# --------------------------------------------------

def clean_text(text: str) -> str:
    """
    Remove newlines, tabs, and repeated whitespace.
    Keep the actual text and punctuation intact.
    """
    text = text.replace("\r", " ")
    text = text.replace("\n", " ")
    text = text.replace("\t", " ")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


# --------------------------------------------------
# Stable record IDs
# --------------------------------------------------

def make_id(source: str, content: str) -> str:
    """
    Identical source + content produces the same ID.
    """
    raw = f"{source}::{content}"
    return hashlib.sha256(
        raw.encode("utf-8")
    ).hexdigest()[:40]


# --------------------------------------------------
# Extract a section heading
# --------------------------------------------------

def get_section(text: str) -> str:
    """
    Find a heading inside a chunk.
    Works with headings retained by the splitter.
    """
    for line in text.splitlines():
        line = line.strip()

        if line.startswith("#"):
            return line.lstrip("#").strip() or "General"

    return "General"


# --------------------------------------------------
# Main ingestion process
# --------------------------------------------------

def main():

    # 1. Validate configuration
    if not API_KEY or API_KEY == "your_actual_api_key":
        sys.exit(
            "ERROR: Add your real PINECONE_API_KEY to .env"
        )

    if not KNOWLEDGE_FILE.exists():
        sys.exit(
            f"ERROR: File not found: {KNOWLEDGE_FILE}"
        )

    # 2. Connect to Pinecone
    pc = Pinecone(api_key=API_KEY)

    index_names = [
        index.name for index in pc.list_indexes()
    ]

    if INDEX_NAME not in index_names:
        sys.exit(
            f"ERROR: Pinecone index '{INDEX_NAME}' does not exist."
        )

    index_info = pc.describe_index(INDEX_NAME)

    dimension = index_info.dimension
    metric = index_info.metric

    print(f"Index: {INDEX_NAME}")
    print(f"Dimension: {dimension}")
    print(f"Metric: {metric}")

    if dimension != EXPECTED_DIMENSION:
        sys.exit(
            f"ERROR: Index dimension is {dimension}; "
            f"expected {EXPECTED_DIMENSION}. No upload performed."
        )

    if metric != "cosine":
        sys.exit(
            f"ERROR: Expected cosine metric, found {metric}. "
            "No upload performed."
        )

    # 3. Load the original text
    documents = TextLoader(
        str(KNOWLEDGE_FILE),
        encoding="utf-8",
    ).load()

    # Preserve headings during splitting
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=80,
        length_function=len,
        add_start_index=True,
    )

    chunks = splitter.split_documents(documents)

    if not chunks:
        sys.exit("ERROR: No text chunks found.")

    # 4. Clean each chunk and attach metadata
    cleaned_chunks = []
    ids = []

    source_name = KNOWLEDGE_FILE.name

    for chunk_index, doc in enumerate(chunks):

        # Remove literal newline and repeated whitespace
        content = clean_text(doc.page_content)

        if not content:
            continue

        start_index = int(
            doc.metadata.get("start_index", 0)
        )

        # Clean before embedding and storing
        doc.page_content = content

        doc.metadata = {
            "source": source_name,
            "scheme_name": SCHEME_NAME,
            "category": CATEGORY,
            "section": get_section(content),
            "chunk_index": chunk_index,
            "start_index": start_index,
            "is_fictional": True,
            "dataset_version": "1.0",
        }

        cleaned_chunks.append(doc)
        ids.append(make_id(source_name, content))

    if not cleaned_chunks:
        sys.exit("ERROR: No non-empty chunks remain after cleaning.")

    # 5. Initialize local embeddings
    print(f"\nLoading embedding model: {EMBEDDING_MODEL}")

    embeddings = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL,
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True},
    )

    actual_dimension = len(
        embeddings.embed_query("dimension test")
    )

    if actual_dimension != EXPECTED_DIMENSION:
        sys.exit(
            f"ERROR: Embedding dimension is {actual_dimension}; "
            f"expected {EXPECTED_DIMENSION}."
        )

    # 6. Connect LangChain to the existing index
    vector_store = PineconeVectorStore(
        index_name=INDEX_NAME,
        embedding=embeddings,
        pinecone_api_key=API_KEY,
    )

    # 7. Upload in batches
    print(f"\nPrepared {len(cleaned_chunks)} chunks.")
    print("Text cleaning: enabled")
    print("Metadata: source, scheme_name, category, section,")
    print("          chunk_index, start_index, is_fictional,")
    print("          dataset_version")
    print("\nUploading to Pinecone...")

    batch_size = 100

    for start in range(0, len(cleaned_chunks), batch_size):
        batch_docs = cleaned_chunks[start:start + batch_size]
        batch_ids = ids[start:start + batch_size]

        vector_store.add_documents(
            documents=batch_docs,
            ids=batch_ids,
        )

        uploaded = min(
            start + batch_size,
            len(cleaned_chunks),
        )

        print(f"Uploaded {uploaded}/{len(cleaned_chunks)}")

    print("\nIngestion complete.")
    print(f"Index: {INDEX_NAME}")
    print(f"Chunks uploaded: {len(cleaned_chunks)}")
    print("Check Pinecone's record count to verify ingestion.")


if __name__ == "__main__":
    main()
