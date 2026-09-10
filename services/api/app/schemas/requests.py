from __future__ import annotations
from pydantic import Field

from app.schemas.base import CamelModel


class CreateProjectRequest(CamelModel):
    title: str = Field(min_length=1, max_length=160)
    description: str | None = None


class CreateGapRequest(CamelModel):
    gap_text: str = Field(min_length=1)


class RunSearchRequest(CamelModel):
    query: str = Field(min_length=1)
    limit: int = Field(default=10, ge=1, le=50)
    languages: list[str] = Field(default_factory=list)
    document_types: list[str] = Field(default_factory=list)
    year_from: int | None = None
    year_to: int | None = None


class RunGateAssessmentRequest(CamelModel):
    search_run_id: str | None = None
    decision_link: str | None = None
    available_data: str | None = None
    participants: str | None = None
    tools: str | None = None
    time_budget: str | None = None
    collaboration: str | None = None
    notes: str | None = None


class CreateRewriteOptionsRequest(CamelModel):
    search_run_id: str | None = None


class CreateResearcherDecisionRequest(CamelModel):
    action: str = Field(min_length=1)
    rewrite_option_id: str | None = None
    rationale: str | None = None
    reverify: bool = True


class CreateResearcherAnnotationRequest(CamelModel):
    relevance_label: str = Field(min_length=1)
    relation_label: str = Field(min_length=1)
    notes: str | None = None
