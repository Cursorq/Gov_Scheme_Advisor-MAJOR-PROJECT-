# RAG with Qwen2.5 + Pinecone

A minimal, working Retrieval-Augmented Generation (RAG) prototype built to test:

- **Local LLM inference** — [Qwen2.5:7b](https://ollama.com/library/qwen2.5) via [Ollama](https://ollama.ai)
- **Cloud vector database** — [Pinecone](https://www.pinecone.io) (serverless)
- **Orchestration** — [LangGraph](https://langchain-ai.github.io/langgraph/) (`StateGraph`)
- **Embeddings** — `sentence-transformers/all-MiniLM-L6-v2` (384-dim, local, free)

> **Privacy note:** LLM inference runs entirely on your machine via Ollama.  
> Pinecone stores your document embeddings in the cloud. Keep that in mind before indexing sensitive data.

---

## Project Structure

```
rag-qwen-pinecone/
├── data/
│   └── knowledge.txt       # Fictional test knowledge base (EFGP scheme)
├── rag.py                  # Main script — ingestion + LangGraph workflow + CLI
├── requirements.txt
├── .env.example            # Copy this to .env and fill in your keys
├── .gitignore
└── README.md
```

---

## How It Works

```
knowledge.txt
     │
     ▼
[TextLoader] Load raw text
     │
     ▼
[RecursiveCharacterTextSplitter] Split into ~500-char chunks (80-char overlap)
     │
     ▼
[HuggingFaceEmbeddings] Embed each chunk → 384-dim vector
     │
     ▼
[Pinecone] Store vectors + metadata (source, chunk_id, text) in cloud index
     │
     │                          ┌───────────────────┐
     │  User question ──────────► LangGraph Workflow │
     │                          └───────────────────┘
     │                              │           │
     │                         [retrieve]   [generate]
     │                              │           │
     │                         Embed query  Build prompt
     │                         Pinecone k=3 Call Qwen2.5
     │                              │           │
     └──────────────────────────────┘    Final answer
```

### LangChain vs LangGraph

| | LangChain | LangGraph |
|---|---|---|
| **What it is** | A toolkit of composable components (loaders, splitters, retrievers, prompts, LLM wrappers) | A graph-based workflow orchestration layer built on top of LangChain |
| **Analogy** | Individual tools in a toolbox | The assembly line that uses those tools in a defined order |
| **Used for** | Document loading, chunking, embeddings, retrieval, prompt formatting, LLM calls | Defining the flow: `START → retrieve → generate → END` |
| **State** | Stateless per call | Typed `RAGState` dict passed between nodes |

In this project: LangChain supplies the building blocks; LangGraph wires them into a directed graph where each node has a clear, testable responsibility.

---

## Prerequisites

| Requirement | Notes |
|---|---|
| Python 3.10+ | Tested on 3.11 |
| [Ollama](https://ollama.ai) | For local Qwen2.5 inference |
| Pinecone account | Free tier is sufficient; get key at [app.pinecone.io](https://app.pinecone.io) |
| ~4 GB RAM free | For Qwen2.5:7b (quantized) |
| Internet | Only for Pinecone API calls and initial model download |

---

## Setup (macOS)

### 1 — Clone / enter the project directory

```bash
cd rag-qwen-pinecone
```

### 2 — Create and activate a virtual environment

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3 — Install dependencies

```bash
pip install -r requirements.txt
```

> The first run also downloads the `all-MiniLM-L6-v2` model (~80 MB) to `~/.cache/huggingface/`.

### 4 — Install and start Ollama

```bash
# Install (if not already installed)
brew install ollama

# Start the Ollama server (runs in the background)
ollama serve &

# Pull Qwen2.5 7B (downloads ~4–5 GB once)
ollama pull qwen2.5:7b

# Verify
ollama list
```

### 5 — Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```dotenv
PINECONE_API_KEY=<your key from app.pinecone.io>
PINECONE_INDEX_NAME=rag-qwen-test
PINECONE_CLOUD=aws          # or gcp / azure
PINECONE_REGION=us-east-1   # pick a region close to you (see note below)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:7b
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
```

> **Pinecone region note:**  
> Free-tier serverless indexes are available on AWS. Common choices:  
> `us-east-1` (N. Virginia) · `us-west-2` (Oregon) · `eu-west-1` (Ireland)  
> You can also pre-create the index in the Pinecone console and set the same name in `PINECONE_INDEX_NAME` — the script will detect and reuse it.

### 6 — Run the pipeline

```bash
python rag.py
```

On first run, the script will:

1. Load and chunk `data/knowledge.txt`
2. Generate embeddings (local, CPU)
3. Create the Pinecone index (if it doesn't exist)
4. Upsert all chunk vectors
5. Launch the interactive CLI

On subsequent runs, the Pinecone index is reused. Duplicate vectors are avoided using deterministic MD5-based IDs.

---

## Example Session

```
=== RAG Pipeline — Qwen2.5 + Pinecone ===

[Ingestion] Loaded 'data/knowledge.txt' → 28 chunks
[Embeddings] Verified output dimension: 384
[Pinecone] Reusing index 'rag-qwen-test' (dim=384, metric=cosine)
[Pinecone] Done — 28 chunks indexed.
[LLM] Connecting to Ollama at http://localhost:11434, model='qwen2.5:7b'

────────────────────────────────────────────────────
  RAG with Qwen2.5 and Pinecone is ready
────────────────────────────────────────────────────

You: Who can apply for the fictional education assistance scheme?

[Retrieve] Querying Pinecone for: 'Who can apply for the fictional education assistance scheme?'
  ─ Chunk 1 ─ (source: knowledge.txt)
  To qualify for the fictional EduAssist Grant, an applicant must meet ALL ...

[Generate] Sending context + question to qwen2.5:7b …

Answer:
To apply for the fictional EduAssist Grant Program (EFGP), an applicant must:
1. Be between 17 and 30 years old...
(source: knowledge.txt)

Sources: knowledge.txt
```

---

## Test Questions

Use these to verify the system works correctly:

| # | Question | Expected behaviour |
|---|---|---|
| 1 | Who can apply for the fictional education assistance scheme? | Lists eligibility conditions from knowledge.txt |
| 2 | What benefits does it provide? | Lists tuition waiver, stipend, allowances |
| 3 | Which documents are required? | Lists the 9 required documents |
| 4 | How can someone apply? | Describes the 8-step application procedure |
| 5 | Does it provide free laptops? | Should say **no** — hardware is excluded |
| 6 | What is the capital of Japan? | Should say **insufficient information** — not in knowledge base |

Questions 5 and 6 test whether the model correctly abstains. Note: prompt instructions alone don't guarantee abstention — your retrieval context is what ultimately limits the answer.

---

## Troubleshooting

### `PINECONE_API_KEY is not set`
→ Copy `.env.example` to `.env` and add your key.

### `Connection refused` / Ollama errors
```bash
# Check Ollama is running
curl http://localhost:11434/api/tags

# Restart if needed
ollama serve
```

### `ollama pull qwen2.5:7b` — model not found
```bash
# List available models
ollama list

# Try the smaller variant if RAM is tight
ollama pull qwen2.5:3b
# Then update OLLAMA_MODEL=qwen2.5:3b in .env
```

### Pinecone dimension mismatch
If you see an index dimension error, the index was created with different settings. Delete it in the [Pinecone console](https://app.pinecone.io) and re-run, or set a different `PINECONE_INDEX_NAME`.

### Slow first run
The first run downloads `all-MiniLM-L6-v2` (~80 MB) and generates embeddings on CPU. This takes 30–90 seconds depending on your machine. Subsequent runs skip the download.

### `ModuleNotFoundError`
```bash
# Make sure the venv is active
source venv/bin/activate
pip install -r requirements.txt
```

---

## Architecture Summary

```
┌─────────────────────────────────────────────────────────────┐
│                        Your Machine                         │
│                                                             │
│  rag.py                                                     │
│   ├─ HuggingFaceEmbeddings  (sentence-transformers, CPU)    │
│   ├─ ChatOllama → Qwen2.5:7b  (Ollama, local inference)     │
│   └─ LangGraph StateGraph    (retrieve → generate)          │
│                                    │                        │
└────────────────────────────────────┼────────────────────────┘
                                     │ HTTPS API
                              ┌──────▼──────┐
                              │  Pinecone   │
                              │  (Cloud)    │
                              │  384-dim    │
                              │  cosine idx │
                              └─────────────┘
```

**Local:** Embeddings, LLM inference  
**Cloud:** Vector storage and similarity search (Pinecone)

---

## License

This project is a personal test harness using fictional data. Use it freely.
