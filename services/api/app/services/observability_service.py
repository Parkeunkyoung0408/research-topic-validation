from __future__ import annotations
from collections import Counter
from typing import Any

from app.domain.models import ResearcherAnnotation
from app.repositories.in_memory import InMemoryStore
from app.schemas.requests import CreateResearcherAnnotationRequest
from app.schemas.responses import (
    DecisionQualityItemResponse,
    EvidenceQualityItemResponse,
    ObservabilityDashboardResponse,
    ObservabilityMetricResponse,
    ObservabilityTimelineEventResponse,
    PaperResponse,
    ResearcherAnnotationResponse,
)


class ObservabilityService:
    def __init__(self, repository: InMemoryStore) -> None:
        self.repository = repository

    def get_latest_dashboard(self) -> ObservabilityDashboardResponse:
        gap = self.repository.latest_gap()
        return self.get_dashboard(gap.id) if gap else _empty_dashboard()

    def get_dashboard(self, gap_id: str) -> ObservabilityDashboardResponse:
        gap = self.repository.get_gap(gap_id)
        if not gap:
            raise KeyError(f"Gap not found: {gap_id}")

        search_runs = [item for item in self.repository.search_runs.values() if item.gap_id == gap_id]
        latest_search_run = sorted(search_runs, key=lambda item: item.created_at)[-1] if search_runs else None
        search_results = self.repository.list_search_results(latest_search_run.id) if latest_search_run else []
        evidence = self.repository.list_gap_evidence(gap_id)
        evidence_roles = {
            item.id: self.repository.list_gap_evidence_roles(item.id)
            for item in evidence
        }
        role_counts = Counter(role.role_type for roles in evidence_roles.values() for role in roles)
        decisions = self.repository.list_researcher_decisions(gap_id)

        return ObservabilityDashboardResponse(
            gapId=gap_id,
            overview=[
                _metric("검색 논문 수", len(search_results), "available"),
                _metric("Rerank 논문 수", "미구현", "not_available", "Reranker 저장 로그가 아직 없습니다."),
                _metric("Evidence 수", len(evidence), "available"),
                _metric("Counter Evidence 수", role_counts["COUNTER"], "available"),
                _metric("Query Rewrite 횟수", _query_rewrite_count(search_runs), "available"),
            ],
            searchQuality=self._search_quality(gap_id, latest_search_run, search_results, evidence),
            searchTimeline=self._search_timeline(search_runs, latest_search_run, evidence),
            evidenceQuality=[self._evidence_quality_item(item) for item in evidence],
            decisionQuality=self._decision_quality(gap_id, evidence),
            evaluationDataset={
                "annotations": [
                    ResearcherAnnotationResponse.model_validate(item.__dict__)
                    for item in self.repository.list_researcher_annotations()
                ],
                "goldSetStatus": "not_built",
                "note": "연구자 annotation은 저장되지만 Gold Set 평가지표는 아직 계산하지 않습니다.",
            },
            unavailableMetrics=_unavailable_metrics(),
        )

    def create_annotation(
        self,
        gap_evidence_id: str,
        payload: CreateResearcherAnnotationRequest,
    ) -> ResearcherAnnotationResponse:
        if gap_evidence_id not in self.repository.gap_evidence:
            raise KeyError(f"Gap evidence not found: {gap_evidence_id}")
        annotation = self.repository.add_researcher_annotation(
            ResearcherAnnotation(
                gap_evidence_id=gap_evidence_id,
                relevance_label=payload.relevance_label,
                relation_label=payload.relation_label,
                notes=payload.notes,
            )
        )
        return ResearcherAnnotationResponse.model_validate(annotation.__dict__)

    def _search_quality(self, gap_id: str, search_run, search_results, evidence) -> dict[str, Any]:
        conditions = self.repository.list_conditions(gap_id)
        coverage: list[dict[str, Any]] = []
        for condition in conditions:
            covered = [
                item.id
                for item in evidence
                if condition.label in item.matched_conditions_json
            ]
            coverage.append(
                {
                    "condition": condition.label,
                    "role": condition.role,
                    "evidenceCount": len(covered),
                    "status": "covered" if covered else "not_covered",
                }
            )

        query_snapshot = search_run.query_snapshot if search_run else {}
        source_scope = search_run.source_scope if search_run else {}
        return {
            "originalQuery": query_snapshot.get("query"),
            "rewrittenQuery": query_snapshot.get("rewrittenQuery"),
            "searchedPaperCount": len(search_results),
            "rerankedPaperCount": None,
            "coreConditionEvidenceCoverage": coverage,
            "queryRewriteReason": source_scope.get("queryRewriteReason"),
            "newEvidenceAfterRewrite": None,
            "counterEvidenceCount": self._counter_evidence_count(evidence),
            "evaluationLayer": {
                "interfaceReady": True,
                "metrics": ["Recall@10", "Recall@20", "Precision@10", "nDCG@10", "Counter-Evidence Recall"],
                "status": "gold_set_required",
            },
        }

    def _search_timeline(self, search_runs, latest_search_run, evidence) -> list[ObservabilityTimelineEventResponse]:
        has_search = bool(latest_search_run)
        coverage_gap = any(not item.matched_conditions_json for item in evidence) if evidence else False
        rewrite_count = _query_rewrite_count(search_runs)
        return [
            ObservabilityTimelineEventResponse(label="Original Query", status="done" if has_search else "pending", detail="원본 검색어 저장"),
            ObservabilityTimelineEventResponse(label="Search", status="done" if has_search else "pending", detail="OpenAlex 검색 실행"),
            ObservabilityTimelineEventResponse(
                label="Coverage 부족 감지",
                status="done" if coverage_gap else "not_detected",
                detail="조건별 Evidence coverage 기반 감지",
            ),
            ObservabilityTimelineEventResponse(
                label="Query Rewrite",
                status="done" if rewrite_count else "not_run",
                detail="현재 자동 Query Rewrite는 아직 실행하지 않음",
            ),
            ObservabilityTimelineEventResponse(label="Re-search", status="done" if rewrite_count else "not_run", detail="재검색 실행 로그 기준"),
            ObservabilityTimelineEventResponse(
                label="New Evidence",
                status="done" if evidence else "pending",
                detail=f"Evidence {len(evidence)}건 저장",
            ),
        ]

    def _evidence_quality_item(self, evidence) -> EvidenceQualityItemResponse:
        paper = self.repository.get_paper(evidence.paper_id)
        if not paper:
            raise KeyError(f"Paper not found: {evidence.paper_id}")
        passages = self.repository.list_gap_evidence_passages(evidence.id)
        roles = self.repository.list_gap_evidence_roles(evidence.id)
        passage_text = passages[0].passage_text if passages else ""
        claim = _ai_claim(evidence, roles)
        return EvidenceQualityItemResponse(
            gapEvidenceId=evidence.id,
            aiEvidenceClaim=claim,
            originalEvidencePassage=passage_text,
            paper=PaperResponse.model_validate(paper.__dict__),
            source=paper.openalex_id or paper.doi or "unknown",
            citationMatch="not_verified",
            groundingStatus="not_verified",
            unsupportedClaim="not_verified",
            evidenceRelation=", ".join(role.role_type for role in roles) or evidence.overlap_grade,
            annotations=[
                ResearcherAnnotationResponse.model_validate(item.__dict__)
                for item in self.repository.list_researcher_annotations(evidence.id)
            ],
        )

    def _decision_quality(self, gap_id: str, evidence) -> list[DecisionQualityItemResponse]:
        assessments = self.repository.list_gate_assessments(gap_id)
        decisions = self.repository.list_researcher_decisions(gap_id)
        latest_decision = decisions[-1] if decisions else None
        evidence_ids = [item.id for item in evidence]
        return [
            DecisionQualityItemResponse(
                gateType=item.gate_type,
                aiAssessment=f"{item.status}{' · ' + item.grade if item.grade else ''}: {item.rationale}",
                evidenceIds=evidence_ids if item.gate_type == "EXISTENCE" else [],
                researcherDecision=latest_decision.action if latest_decision else None,
                researcherOverride=item.overridden if latest_decision else None,
                decision=latest_decision.action if latest_decision else None,
            )
            for item in assessments
        ]

    def _counter_evidence_count(self, evidence) -> int:
        count = 0
        for item in evidence:
            roles = self.repository.list_gap_evidence_roles(item.id)
            if any(role.role_type == "COUNTER" for role in roles):
                count += 1
        return count


def _metric(label: str, value: int | str | None, status: str, note: str | None = None) -> ObservabilityMetricResponse:
    return ObservabilityMetricResponse(label=label, value=value, status=status, note=note)


def _query_rewrite_count(search_runs) -> int:
    return len([item for item in search_runs if item.query_snapshot.get("rewrittenQuery")])


def _ai_claim(evidence, roles) -> str:
    role_label = ", ".join(role.role_type for role in roles) or "RELATED"
    return f"{evidence.overlap_grade} 관계로 분류됨. Evidence roles: {role_label}."


def _unavailable_metrics() -> list[ObservabilityMetricResponse]:
    return [
        _metric("Recall@10", None, "gold_set_required"),
        _metric("Recall@20", None, "gold_set_required"),
        _metric("Precision@10", None, "gold_set_required"),
        _metric("nDCG@10", None, "gold_set_required"),
        _metric("Counter-Evidence Recall", None, "gold_set_required"),
        _metric("Grounded Rate", None, "verification_required"),
        _metric("Unsupported Claim Rate", None, "verification_required"),
        _metric("Citation Correctness", None, "verification_required"),
        _metric("Evidence Extraction Accuracy", None, "verification_required"),
        _metric("AI-Researcher Agreement Rate", None, "annotation_required"),
        _metric("Override Rate", None, "annotation_required"),
    ]


def _empty_dashboard() -> ObservabilityDashboardResponse:
    return ObservabilityDashboardResponse(
        gapId=None,
        overview=[
            _metric("검색 논문 수", 0, "available"),
            _metric("Rerank 논문 수", "미구현", "not_available"),
            _metric("Evidence 수", 0, "available"),
            _metric("Counter Evidence 수", 0, "available"),
            _metric("Query Rewrite 횟수", 0, "available"),
        ],
        searchQuality={},
        searchTimeline=[],
        evidenceQuality=[],
        decisionQuality=[],
        evaluationDataset={"annotations": [], "goldSetStatus": "not_built"},
        unavailableMetrics=_unavailable_metrics(),
    )
