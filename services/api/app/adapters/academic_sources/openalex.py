from __future__ import annotations
from typing import Any

import httpx

from app.adapters.academic_sources.base import AcademicPaperResult, AcademicSourceAdapter


class OpenAlexAdapter(AcademicSourceAdapter):
    def __init__(self, base_url: str = "https://api.openalex.org") -> None:
        self.base_url = base_url.rstrip("/")

    async def search(self, query: str, limit: int) -> list[AcademicPaperResult]:
        params = {
            "search": query,
            "per-page": min(max(limit, 1), 50),
            "sort": "relevance_score:desc",
        }
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.get(f"{self.base_url}/works", params=params)
            response.raise_for_status()
            payload = response.json()

        if not isinstance(payload, dict) or not isinstance(payload.get("results"), list):
            raise ValueError("Invalid OpenAlex results schema")

        return [self._normalize_work(work) for work in payload.get("results", [])]

    def _normalize_work(self, work: dict[str, Any]) -> AcademicPaperResult:
        primary_location = work.get("primary_location") or {}
        source = primary_location.get("source") or {}
        return AcademicPaperResult(
            source="OPENALEX",
            source_id=work.get("id"),
            doi=work.get("doi"),
            title=work.get("title") or "Untitled work",
            abstract=self._abstract_from_inverted_index(work.get("abstract_inverted_index")),
            publication_year=work.get("publication_year"),
            language=work.get("language"),
            document_type=work.get("type"),
            oa_status=(work.get("open_access") or {}).get("oa_status"),
            score=work.get("relevance_score"),
            raw={
                "openalex_id": work.get("id"),
                "source_display_name": source.get("display_name"),
                "cited_by_count": work.get("cited_by_count"),
                "authorships": work.get("authorships", [])[:5],
            },
        )

    def _abstract_from_inverted_index(self, inverted_index: dict[str, list[int]] | None) -> str | None:
        if not inverted_index:
            return None
        positions: list[tuple[int, str]] = []
        for word, indexes in inverted_index.items():
            positions.extend((index, word) for index in indexes)
        return " ".join(word for _, word in sorted(positions))
