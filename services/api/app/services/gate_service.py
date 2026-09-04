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
        if len(decision_link) >= 80 and motivating_count > 0:
            grade = "A"
            rationale = f"Decision Link가 구체적이고 연구 필요성 근거 {motivating_count}건과 연결됩니다."
        elif len(decision_link) >= 30 or motivating_count > 0:
            grade = "B"
            rationale = "Decision Link 또는 연구 필요성 근거가 있으나, 결론과의 연결을 더 명확히 해야 합니다."
        else:
            grade = "C"
            rationale = "연구하면 무엇이 달라지는지에 대한 Decision Link가 부족합니다."

        return GateAssessment(
            gap_id=gap_id,
            search_run_id=payload.search_run_id,
            gate_type="VALUE",
            status="ASSESSED",
            grade=grade,
            rationale=rationale,
            inputs_json={"decisionLink": decision_link, "motivatingEvidenceCount": motivating_count},
        )

    def _feasibility_assessment(self, gap_id: str, payload: RunGateAssessmentRequest) -> GateAssessment:
        resource_fields = [
            payload.available_data,
            payload.participants,
            payload.tools,
            payload.time_budget,
            payload.collaboration,
        ]
        resource_count = len([value for value in resource_fields if value and value.strip()])
        enabling_count = self._count_roles(gap_id, {"ENABLING"})

        if resource_count >= 4 and enabling_count > 0:
            status = "FEASIBLE"
            rationale = f"연구자 자원 입력이 충분하고 실행 근거 {enabling_count}건이 있습니다."
        elif payload.collaboration and payload.collaboration.strip():
            status = "COLLAB_REQUIRED"
            rationale = "일부 자원은 협업을 통해 보완할 수 있는 상태입니다."
        elif resource_count >= 2:
            status = "RESOURCE_REQUIRED"
            rationale = "기본 자원은 있으나 데이터, 참여자, 도구, 시간 중 추가 확보가 필요합니다."
        else:
            status = "HOLD"
            rationale = "실행 가능성을 판단하기 위한 연구자 자원 정보가 부족합니다."

        return GateAssessment(
            gap_id=gap_id,
            search_run_id=payload.search_run_id,
            gate_type="FEASIBILITY",
            status=status,
            rationale=rationale,
            inputs_json={"resourceCount": resource_count, "enablingEvidenceCount": enabling_count},
        )

    def _count_roles(self, gap_id: str, role_types: set[str]) -> int:
        count = 0
        for evidence in self.repository.list_gap_evidence(gap_id):
            roles = self.repository.list_gap_evidence_roles(evidence.id)
            if any(role.role_type in role_types for role in roles):
                count += 1
        return count
