from datetime import date

import httpx

from app.adapters.academic_sources.openalex import OpenAlexAdapter
from app.domain.models import Paper, SearchResult, SearchRun
from app.repositories.in_memory import InMemoryStore
from app.schemas.requests import RunSearchRequest
from app.schemas.responses import PaperResponse, SearchResultResponse, SearchRunResponse
from app.services.evidence_service import EvidenceService


class SearchService:
    def __init__(self, repository: InMemoryStore, adapter: OpenAlexAdapter | None = None) -> None:
        self.repository = repository
        self.adapter = adapter or OpenAlexAdapter()
        self.evidence_service = EvidenceService(repository)

    async def run_openalex_search(self, gap_id: str, payload: RunSearchRequest) -> SearchRunResponse:
        if not self.repository.get_gap(gap_id):
            raise KeyError(f"Gap not found: {gap_id}")

        source_scope = {
            "sources": ["OPENALEX"],
            "languages": payload.languages,
            "documentTypes": payload.document_types,
            "yearFrom": payload.year_from,
            "yearTo": payload.year_to,
            "fulltextPolicy": "ABSTRACT_OR_FULLTEXT",
            "searchedAt": date.today().isoformat(),
        }
        query_snapshot = {
            "query": payload.query,
            "strategy": "OPENALEX_SEARCH",
            "expansion": "PENDING",
        }

        try:
            papers = await self.adapter.search(payload.query, payload.limit)
            adapter_error = None
        except httpx.HTTPError as exc:
            papers = []
            adapter_error = str(exc)

        search_run = self.repository.add_search_run(
            SearchRun(
                gap_id=gap_id,
                source_scope={**source_scope, "adapterError": adapter_error},
                query_snapshot=query_snapshot,
                search_budget={"limit": payload.limit},
                model_versions={"openalexAdapter": "0.1.0"},
                result_count=len(papers),
                year_from=payload.year_from,
                year_to=payload.year_to,
                languages=payload.languages,
                document_types=payload.document_types,
            )
        )

        for rank, item in enumerate(papers, start=1):
            paper = self.repository.upsert_paper(
                Paper(
                    title=item.title,
                    doi=item.doi,
                    openalex_id=item.source_id,
                    abstract=item.abstract,
                    publication_year=item.publication_year,
                    language=item.language,
                    document_type=item.document_type,
                    oa_status=item.oa_status,
                    metadata_json=item.raw,
                )
            )
            self.repository.add_search_result(
                SearchResult(
                    search_run_id=search_run.id,
                    paper_id=paper.id,
                    source=item.source,
                    rank=rank,
                    score=item.score,
                    raw_result=item.raw,
                )
            )
            self.evidence_service.code_paper_for_gap(gap_id, paper)

        return self.get_search_run(search_run.id)

    def get_search_run(self, search_run_id: str) -> SearchRunResponse:
        search_run = self.repository.get_search_run(search_run_id)
        if not search_run:
            raise KeyError(f"Search run not found: {search_run_id}")

        results: list[SearchResultResponse] = []
        for result in self.repository.list_search_results(search_run_id):
            paper = self.repository.get_paper(result.paper_id)
            if paper:
                results.append(
                    SearchResultResponse(
                        id=result.id,
                        paper=PaperResponse.model_validate(paper.__dict__),
                        source=result.source,
                        rank=result.rank,
                        score=result.score,
                    )
                )

        return SearchRunResponse(
            id=search_run.id,
            gapId=search_run.gap_id,
            sourceScope=search_run.source_scope,
            querySnapshot=search_run.query_snapshot,
            resultCount=search_run.result_count,
            createdAt=search_run.created_at,
            results=results,
        )
