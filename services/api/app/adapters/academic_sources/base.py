from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class AcademicPaperResult:
    source: str
    source_id: str | None
    doi: str | None
    title: str
    abstract: str | None
    publication_year: int | None
    language: str | None
    document_type: str | None
    oa_status: str | None
    score: float | None
    raw: dict[str, Any]


class AcademicSourceAdapter(ABC):
    @abstractmethod
    async def search(self, query: str, limit: int) -> list[AcademicPaperResult]:
        raise NotImplementedError
