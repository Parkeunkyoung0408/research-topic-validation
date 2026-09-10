from __future__ import annotations
from datetime import datetime
from typing import Any

from app.schemas.base import CamelModel


class ProjectResponse(CamelModel):
    id: str
    title: str
    description: str | None = None
    created_at: datetime


class GapHypothesisResponse(CamelModel):
    id: str
    project_id: str
    gap_text: str
    status: str
    created_at: datetime


class GapConditionResponse(CamelModel):
    id: str
    gap_id: str
    label: str
    role: str
    mechanism: str | None = None
    justification: str | None = None
    is_load_bearing: bool
    sort_order: int


class GapCreateResponse(CamelModel):
    gap: GapHypothesisResponse
    conditions: list[GapConditionResponse]


class PaperResponse(CamelModel):
    id: str
    title: str
    doi: str | None = None
    openalex_id: str | None = None
    publication_year: int | None = None
    language: str | None = None
    document_type: str | None = None
    oa_status: str | None = None


class SearchResultResponse(CamelModel):
    id: str
    paper: PaperResponse
    source: str
    rank: int
    score: float | None = None


class SearchRunResponse(CamelModel):
    id: str
    gap_id: str
    source_scope: dict[str, Any]
    query_snapshot: dict[str, Any]
    result_count: int
    created_at: datetime
    results: list[SearchResultResponse]


class EvidencePassageResponse(CamelModel):
    id: str
    paper_id: str
    passage_text: str
    document_id: str | None = None
    section: str | None = None
    page_no: int | None = None
    start_offset: int | None = None
    end_offset: int | None = None


class GapEvidenceResponse(CamelModel):
    id: str
    gap_id: str
    paper: PaperResponse
    overlap_grade: str
    strength: float
    matched_conditions: list[str]
    mismatched_conditions: list[str]
    roles: list[dict[str, Any]]
    passages: list[EvidencePassageResponse]


class GateReviewResponse(CamelModel):
    gate_type: str
    status: str
    grade: str | None = None
    rationale: str
    evidence_count: int


class GapReviewResponse(CamelModel):
    gap_id: str
    gates: list[GateReviewResponse]


class RewriteOptionResponse(CamelModel):
    id: str
    gap_id: str
    action: str
    title: str
    rewritten_gap_text: str
    rationale: str
    created_at: datetime


class RewriteOptionsResponse(CamelModel):
    gap_id: str
    options: list[RewriteOptionResponse]


class ResearcherDecisionResponse(CamelModel):
    id: str
    gap_id: str
    action: str
    rewrite_option_id: str | None = None
    new_gap_id: str | None = None
    rationale: str | None = None
    created_at: datetime


class ResearcherAnnotationResponse(CamelModel):
    id: str
    gap_evidence_id: str
    relevance_label: str
    relation_label: str
    notes: str | None = None
    created_at: datetime


class ObservabilityMetricResponse(CamelModel):
    label: str
    value: int | str | None = None
    status: str
    note: str | None = None


class ObservabilityTimelineEventResponse(CamelModel):
    label: str
    status: str
    detail: str


class EvidenceQualityItemResponse(CamelModel):
    gap_evidence_id: str
    ai_evidence_claim: str | None = None
    original_evidence_passage: str
    paper: PaperResponse
    source: str
    citation_match: str
    grounding_status: str
    unsupported_claim: str
    evidence_relation: str
    annotations: list[ResearcherAnnotationResponse]


class DecisionQualityItemResponse(CamelModel):
    gate_type: str
    ai_assessment: str
    evidence_ids: list[str]
    researcher_decision: str | None = None
    researcher_override: bool | None = None
    decision: str | None = None


class ObservabilityDashboardResponse(CamelModel):
    gap_id: str | None
    overview: list[ObservabilityMetricResponse]
    search_quality: dict[str, Any]
    search_timeline: list[ObservabilityTimelineEventResponse]
    evidence_quality: list[EvidenceQualityItemResponse]
    decision_quality: list[DecisionQualityItemResponse]
    evaluation_dataset: dict[str, Any]
    unavailable_metrics: list[ObservabilityMetricResponse]
