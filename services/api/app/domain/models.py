from __future__ import annotations
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any
from uuid import uuid4


def new_id() -> str:
    return str(uuid4())


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


@dataclass
class Project:
    title: str
    description: str | None = None
    id: str = field(default_factory=new_id)
    created_at: datetime = field(default_factory=utc_now)


@dataclass
class GapHypothesis:
    project_id: str
    gap_text: str
    status: str = "DRAFT"
    parent_gap_id: str | None = None
    version_no: int = 1
    id: str = field(default_factory=new_id)
    created_at: datetime = field(default_factory=utc_now)


@dataclass
class GapCondition:
    gap_id: str
    label: str
    role: str
    mechanism: str | None = None
    justification: str | None = None
    is_load_bearing: bool = False
    sort_order: int = 0
    id: str = field(default_factory=new_id)


@dataclass
class Paper:
    title: str
    doi: str | None = None
    openalex_id: str | None = None
    abstract: str | None = None
    publication_year: int | None = None
    language: str | None = None
    document_type: str | None = None
    oa_status: str | None = None
    metadata_json: dict[str, Any] = field(default_factory=dict)
    id: str = field(default_factory=new_id)


@dataclass
class SearchRun:
    gap_id: str
    source_scope: dict[str, Any]
    query_snapshot: dict[str, Any]
    search_budget: dict[str, Any]
    model_versions: dict[str, Any]
    result_count: int
    year_from: int | None = None
    year_to: int | None = None
    languages: list[str] = field(default_factory=list)
    document_types: list[str] = field(default_factory=list)
    fulltext_policy: str = "ABSTRACT_OR_FULLTEXT"
    id: str = field(default_factory=new_id)
    created_at: datetime = field(default_factory=utc_now)


@dataclass
class SearchResult:
    search_run_id: str
    paper_id: str
    source: str
    rank: int
    score: float | None
    raw_result: dict[str, Any]
    id: str = field(default_factory=new_id)


@dataclass
class PaperCoding:
    paper_id: str
    coding_schema_version: str
    research_mode: str | None = None
    population_json: dict[str, Any] = field(default_factory=dict)
    context_json: dict[str, Any] = field(default_factory=dict)
    method_json: dict[str, Any] = field(default_factory=dict)
    outcomes_json: dict[str, Any] = field(default_factory=dict)
    claims_json: dict[str, Any] = field(default_factory=dict)
    limitations_json: dict[str, Any] = field(default_factory=dict)
    resources_json: dict[str, Any] = field(default_factory=dict)
    id: str = field(default_factory=new_id)


@dataclass
class EvidencePassage:
    paper_id: str
    passage_text: str
    document_id: str | None = None
    section: str | None = None
    page_no: int | None = None
    start_offset: int | None = None
    end_offset: int | None = None
    id: str = field(default_factory=new_id)


@dataclass
class GapEvidence:
    gap_id: str
    paper_id: str
    overlap_grade: str
    strength: float
    matched_conditions_json: list[str] = field(default_factory=list)
    mismatched_conditions_json: list[str] = field(default_factory=list)
    classifier_version: str = "heuristic-0.1.0"
    id: str = field(default_factory=new_id)


@dataclass
class GapEvidenceRole:
    gap_evidence_id: str
    role_type: str
    confidence: float
    id: str = field(default_factory=new_id)


@dataclass
class GapEvidencePassage:
    gap_evidence_id: str
    passage_id: str
    id: str = field(default_factory=new_id)


@dataclass
class ResearcherProfile:
    project_id: str
    available_data: str | None = None
    participants: str | None = None
    tools: str | None = None
    time_budget: str | None = None
    collaboration: str | None = None
    notes: str | None = None
    id: str = field(default_factory=new_id)
    created_at: datetime = field(default_factory=utc_now)


@dataclass
class GateAssessment:
    gap_id: str
    gate_type: str
    status: str
    rationale: str
    search_run_id: str | None = None
    grade: str | None = None
    rule_version: str = "mvp-0.1.0"
    overridden: bool = False
    inputs_json: dict[str, Any] = field(default_factory=dict)
    id: str = field(default_factory=new_id)
    created_at: datetime = field(default_factory=utc_now)


@dataclass
class RewriteOption:
    gap_id: str
    action: str
    title: str
    rewritten_gap_text: str
    rationale: str
    id: str = field(default_factory=new_id)
    created_at: datetime = field(default_factory=utc_now)


@dataclass
class ResearcherDecision:
    gap_id: str
    action: str
    rationale: str | None = None
    rewrite_option_id: str | None = None
    new_gap_id: str | None = None
    id: str = field(default_factory=new_id)
    created_at: datetime = field(default_factory=utc_now)


@dataclass
class ResearcherAnnotation:
    gap_evidence_id: str
    relevance_label: str
    relation_label: str
    notes: str | None = None
    id: str = field(default_factory=new_id)
    created_at: datetime = field(default_factory=utc_now)
