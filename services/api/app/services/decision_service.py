from __future__ import annotations
from collections import Counter

from app.domain.gap_structuring import infer_initial_conditions
from app.domain.models import GapHypothesis, ResearcherDecision, RewriteOption
from app.repositories.in_memory import InMemoryStore
from app.schemas.requests import CreateResearcherDecisionRequest
from app.schemas.responses import (
    GapHypothesisResponse,
    ResearcherDecisionResponse,
    RewriteOptionResponse,
    RewriteOptionsResponse,
)


class DecisionService:
    def __init__(self, repository: InMemoryStore) -> None:
        self.repository = repository

    def generate_rewrite_options(self, gap_id: str) -> RewriteOptionsResponse:
        gap = self.repository.get_gap(gap_id)
        if not gap:
            raise KeyError(f"Gap not found: {gap_id}")

        grades = Counter(item.overlap_grade for item in self.repository.list_gap_evidence(gap_id))
        value = self.repository.latest_gate_assessment(gap_id, "VALUE")
        feasibility = self.repository.latest_gate_assessment(gap_id, "FEASIBILITY")
        options = self.repository.replace_rewrite_options(
            gap_id,
            [
                _narrowing_option(gap, grades),
                _differentiate_option(gap, grades),
                _reframe_option(gap, value, feasibility),
                _hold_option(gap, feasibility),
            ],
        )
        return RewriteOptionsResponse(gapId=gap_id, options=[self._option_response(option) for option in options])

    def create_decision(self, gap_id: str, payload: CreateResearcherDecisionRequest) -> ResearcherDecisionResponse:
        gap = self.repository.get_gap(gap_id)
        if not gap:
            raise KeyError(f"Gap not found: {gap_id}")

        option = self.repository.get_rewrite_option(payload.rewrite_option_id) if payload.rewrite_option_id else None
        if payload.rewrite_option_id and not option:
            raise KeyError(f"Rewrite option not found: {payload.rewrite_option_id}")

        new_gap_id = None
        if payload.reverify and option and payload.action in {"REFRAME", "DIFFERENTIATE"}:
            child_gap = self.repository.add_gap(
                GapHypothesis(
                    project_id=gap.project_id,
                    parent_gap_id=gap.id,
                    version_no=gap.version_no + 1,
                    gap_text=option.rewritten_gap_text,
                    status="DRAFT",
                )
            )
            self.repository.replace_conditions(child_gap.id, infer_initial_conditions(child_gap.id, child_gap.gap_text))
            new_gap_id = child_gap.id

        decision = self.repository.add_researcher_decision(
            ResearcherDecision(
                gap_id=gap_id,
                action=payload.action,
                rewrite_option_id=payload.rewrite_option_id,
                rationale=payload.rationale,
                new_gap_id=new_gap_id,
            )
        )
        return ResearcherDecisionResponse.model_validate(decision.__dict__)

    def _option_response(self, option: RewriteOption) -> RewriteOptionResponse:
        return RewriteOptionResponse.model_validate(option.__dict__)


def _narrowing_option(gap: GapHypothesis, grades: Counter[str]) -> RewriteOption:
    return RewriteOption(
        gap_id=gap.id,
        action="HOLD",
        title="조건 검토 후 보류",
        rewritten_gap_text=gap.gap_text,
        rationale=(
            f"Direct {grades['DIRECT']}건, P1 {grades['P1']}건이 있어 바로 진행하기보다 "
            "겹치는 조건을 먼저 확인하는 선택지입니다."
        ),
    )


def _differentiate_option(gap: GapHypothesis, grades: Counter[str]) -> RewriteOption:
    suffix = " with explicit boundary conditions and evidence-backed differentiation"
    return RewriteOption(
        gap_id=gap.id,
        action="DIFFERENTIATE",
        title="차별화 조건 명시",
        rewritten_gap_text=f"{gap.gap_text}{suffix}",
        rationale=(
            f"P1/P2 후보 {grades['P1'] + grades['P2']}건을 기준으로, "
            "기존 연구와 다른 조건을 명시해 재검색하는 선택지입니다."
        ),
    )


def _reframe_option(gap: GapHypothesis, value, feasibility) -> RewriteOption:
    suffix = " as a decision-support study for concrete research or design choices"
    value_note = f"가치 등급 {value.grade}" if value and value.grade else "가치 근거"
    feasibility_note = feasibility.status if feasibility else "실행 가능성"
    return RewriteOption(
        gap_id=gap.id,
        action="REFRAME",
        title="상위 의사결정 문제로 재구성",
        rewritten_gap_text=f"{gap.gap_text}{suffix}",
        rationale=f"{value_note}와 {feasibility_note} 판정을 반영해 연구 질문의 의사결정 연결을 강화합니다.",
    )


def _hold_option(gap: GapHypothesis, feasibility) -> RewriteOption:
    status = feasibility.status if feasibility else "PENDING_PROFILE"
    return RewriteOption(
        gap_id=gap.id,
        action="PROCEED",
        title="현재 Gap으로 진행",
        rewritten_gap_text=gap.gap_text,
        rationale=f"실행 가능성 상태가 {status}입니다. 연구자가 근거를 검토한 뒤 현재 Gap을 유지할 수 있습니다.",
    )
