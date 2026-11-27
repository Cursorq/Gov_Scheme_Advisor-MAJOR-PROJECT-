import sys
from pathlib import Path

from fastapi import APIRouter

from app.schemas import QueryRequest, QueryResponse, SourceInfo

# Support both layouts: rag.py in backend/ (as described) and at the
# repository root (as it currently exists in this workspace).
BACKEND_DIR = Path(__file__).resolve().parents[2]
PROJECT_DIR = BACKEND_DIR.parent
for import_path in (str(PROJECT_DIR), str(BACKEND_DIR)):
    if import_path not in sys.path:
        sys.path.insert(0, import_path)

from rag import ask_question

router = APIRouter()


@router.post("/api/ask", response_model=QueryResponse)
def ask(request: QueryRequest) -> QueryResponse:
    result = ask_question(request.question)
    sources = [
        SourceInfo(
            section=str(doc.metadata.get("section", "Unknown")),
            source=str(doc.metadata.get("source", "Unknown")),
        )
        for doc in result["documents"]
    ]
    return QueryResponse(answer=result["answer"], sources=sources)
