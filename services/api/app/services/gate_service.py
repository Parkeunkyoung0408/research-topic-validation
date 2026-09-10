from __future__ import annotations
from collections import Counter

from app.domain.models import GateAssessment, ResearcherProfile
from app.repositories.in_memory import InMemoryStore
from app.schemas.requests import RunGateAssessmentRequest
from app.schemas.responses import GapReviewResponse
from app.services.evidence_service import EvidenceService, _existence_rationale, _existence_status


class GateService:
    def __init__(self, repository: InMemoryStore) -> None:
        self.repository = repository
        self.evidence_service = EvidenceService(repository)

    def assess_gap(self, gap_id: str, payload: RunGateAssessmentRequest) -> GapReviewResponse:
        gap = self.repository.get_gap(gap_id)
        if not gap:
            raise KeyError(f"Gap not found: {gap_id}")

        evidence = self.repository.list_gap_evidence(gap_id)
        grades = Counter(item.overlap_grade for item in evidence)

        self.repository.add_researcher_profile(
            ResearcherProfile(
                project_id=gap.project_id,
                available_data=payload.available_data,
                participants=payload.participants,
                tools=payload.tools,
                time_budget=payload.time_budget,
                collaboration=payload.collaboration,
                notes=payload.notes,
            )
        )
        self.repository.add_gate_assessment(
            GateAssessment(
                gap_id=gap_id,
                search_run_id=payload.search_run_id,
                gate_type="EXISTENCE",
                status=_existence_status(grades),
                rationale=_existence_rationale(grades, len(evidence)),
                inputs_json={"evidenceCount": len(evidence), "grades": dict(grades)},
            )
        )
        self.repository.add_gate_assessment(self._value_assessment(gap_id, payload))
        self.repository.add_gate_assessment(self._feasibility_assessment(gap_id, payload))

        return self.evidence_service.get_gap_review(gap_id)

    def _value_assessment(self, gap_id: str, payload: RunGateAssessmentRequest) -> GateAssessment:
        decision_link = (payload.decision_link or "").strip()
        motivating_count = self._count_roles(gap_id, {"MOTIVATING", "CALLS_FOR"})
        if decision_link:
            rationale = "연구 결과를 활용할 의사결정이 기록되었습니다. 이해관계자와 활용 시점을 더 구체화해 보세요."
        else:
            rationale = "연구 결과가 누구의 어떤 의사결정에 쓰일지 기록해 보세요."

        return GateAssessment(
            gap_id=gap_id,
            search_run_id=payload.search_run_id,
            gate_type="VALUE",
            status="PREPARATION_REVIEWED",
            grade=None,
            rationale=rationale,
            inputs_json={"decisionLink": decision_link, "motivatingEvidenceCount": motivating_count},
        )

    def _feasibility_assessment(self, gap_id: str, payload: RunGateAssessmentRequest) -> GateAssessment:
        preparation_fields = [
            payload.decision_link,
            payload.available_data,
            payload.participants,
            payload.tools,
            payload.time_budget,
            payload.collaboration,
            payload.notes,
        ]
        recorded_count = len([value for value in preparation_fields if value and value.strip()])
        enabling_count = self._count_roles(gap_id, {"ENABLING"})

        return GateAssessment(
            gap_id=gap_id,
            search_run_id=payload.search_run_id,
            gate_type="FEASIBILITY",
            status="PREPARATION_REVIEWED",
            rationale=(
                f"연구 준비 항목 {recorded_count}개가 기록되었습니다. "
                "입력된 정보만으로 연구 수행 가능 여부를 판정하지 않습니다."
            ),
            inputs_json={"recordedCount": recorded_count, "enablingEvidenceCount": enabling_count},
        )

    def _count_roles(self, gap_id: str, role_types: set[str]) -> int:
        count = 0
        for evidence in self.repository.list_gap_evidence(gap_id):
            roles = self.repository.list_gap_evidence_roles(evidence.id)
            if any(role.role_type in role_types for role in roles):
                count += 1
        return count
