from typing import List

from pydantic import BaseModel, ConfigDict


class QueryRequest(BaseModel):
    model_config = ConfigDict(strict=True)

    question: str


class SourceInfo(BaseModel):
    model_config = ConfigDict(strict=True)

    section: str
    source: str


class QueryResponse(BaseModel):
    model_config = ConfigDict(strict=True)

    answer: str
    sources: List[SourceInfo]
