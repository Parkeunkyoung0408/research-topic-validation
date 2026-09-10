from __future__ import annotations
from collections import Counter

from app.domain.evidence_classifier import classify_gap_evidence
from app.domain.models import (
    EvidencePassage,
    GapEvidence,
    GapEvidencePassage,
    GapEvidenceRole,
    Paper,
    PaperCoding,
)
from app.repositories.in_memory import InMemoryStore
from app.schemas.responses import (
    EvidencePassageResponse,
    GapEvidenceResponse,
    GapReviewResponse,
    GateReviewResponse,
    PaperResponse,
)


class EvidenceService:
    def __init__(self, repository: InMemoryStore) -> None:
        self.repository = repository

    def code_paper_for_gap(self, gap_id: str, paper: Paper) -> GapEvidence:
        gap = self.repository.get_gap(gap_id)
        if not gap:
            raise KeyError(f"Gap not found: {gap_id}")

        conditions = self.repository.list_conditions(gap_id)
        classification = classify_gap_evidence(gap.gap_text, conditions, paper)

        self.repository.upsert_paper_coding(
            PaperCoding(
                paper_id=paper.id,
                coding_schema_version="mvp-0.1.0",
                research_mode="UNKNOWN",
                claims_json={"title": paper.title},
                limitations_json={"source": "heuristic"},
                resources_json={"openAccessStatus": paper.oa_status},
            )
        )
        passage = self.repository.add_evidence_passage(
            EvidencePassage(
                paper_id=paper.id,
                section="abstract" if paper.abstract else "title",
                passage_text=classification.passage_text,
            )
        )
        evidence = self.repository.add_gap_evidence(
            GapEvidence(
                gap_id=gap_id,
                paper_id=paper.id,
                overlap_grade=classification.overlap_grade,
                strength=classification.strength,
                matched_conditions_json=classification.matched_conditions,
                mismatched_conditions_json=classification.mismatched_conditions,
            )
        )
        self.repository.add_gap_evidence_passage(GapEvidencePassage(gap_evidence_id=evidence.id, passage_id=passage.id))
        for role_type, confidence in classification.roles:
            self.repository.add_gap_evidence_role(
                GapEvidenceRole(gap_evidence_id=evidence.id, role_type=role_type, confidence=confidence)
            )
        return evidence

    def list_gap_evidence(self, gap_id: str) -> list[GapEvidenceResponse]:
        if not self.repository.get_gap(gap_id):
            raise KeyError(f"Gap not found: {gap_id}")
        return [self._evidence_response(item) for item in self.repository.list_gap_evidence(gap_id)]

    def get_gap_review(self, gap_id: str) -> GapReviewResponse:
        evidence = self.repository.list_gap_evidence(gap_id)
        if not self.repository.get_gap(gap_id):
            raise KeyError(f"Gap not found: {gap_id}")

        grades = Counter(item.overlap_grade for item in evidence)
        saved_value = self.repository.latest_gate_assessment(gap_id, "VALUE")
        saved_feasibility = self.repository.latest_gate_assessment(gap_id, "FEASIBILITY")

        return GapReviewResponse(
            gapId=gap_id,
            gates=[
                GateReviewResponse(
                    gateType="EXISTENCE",
                    status=_existence_status(grades),
                    grade=None,
                    rationale=_existence_rationale(grades, len(evidence)),
                    evidenceCount=len(evidence),
                ),
                GateReviewResponse(
                    gateType="VALUE",
                    status=saved_value.status if saved_value else "PENDING_DECISION_LINK",
                    grade=saved_value.grade if saved_value else None,
                    rationale=saved_value.rationale
                    if saved_value
                    else "Decision Link와 Motivating/Calls-for 근거 연결이 필요합니다.",
                    evidenceCount=_role_count(self.repository, gap_id, {"MOTIVATING", "CALLS_FOR"}),
                ),
                GateReviewResponse(
                    gateType="FEASIBILITY",
                    status=saved_feasibility.status if saved_feasibility else "PENDING_PROFILE",
                    grade=saved_feasibility.grade if saved_feasibility else None,
                    rationale=saved_feasibility.rationale
                    if saved_feasibility
                    else "Researcher Profile과 Enabling/Data 근거 연결이 필요합니다.",
                    evidenceCount=_role_count(self.repository, gap_id, {"ENABLING"}),
                ),
            ],
        )

    def _evidence_response(self, evidence: GapEvidence) -> GapEvidenceResponse:
        paper = self.repository.get_paper(evidence.paper_id)
        if not paper:
            raise KeyError(f"Paper not found: {evidence.paper_id}")
        roles = self.repository.list_gap_evidence_roles(evidence.id)
        passages = self.repository.list_gap_evidence_passages(evidence.id)
        return GapEvidenceResponse(
            id=evidence.id,
            gapId=evidence.gap_id,
            paper=PaperResponse.model_validate(paper.__dict__),
            overlapGrade=evidence.overlap_grade,
            strength=evidence.strength,
            matchedConditions=evidence.matched_conditions_json,
            mismatchedConditions=evidence.mismatched_conditions_json,
            roles=[{"roleType": role.role_type, "confidence": role.confidence} for role in roles],
            passages=[EvidencePassageResponse.model_validate(passage.__dict__) for passage in passages],
        )


def _existence_status(grades: Counter[str]) -> str:
    if grades["DIRECT"] > 0:
        return "EXISTING"
    if grades["P1"] >= 2:
        return "NARROWING_REQUIRED"
    if grades["P1"] == 1 or grades["P2"] >= 3:
        return "FRAGILE"
    if sum(grades.values()) > 0:
        return "NOVEL_WITHIN_SCOPE"
    return "NO_EVIDENCE"


def _existence_rationale(grades: Counter[str], total: int) -> str:
    if total == 0:
        return "아직 분류된 Evidence가 없습니다."
    return (
        f"검색 후보 {total}건 중 Direct {grades['DIRECT']}건, "
        f"P1 {grades['P1']}건, P2 {grades['P2']}건, 인접 {grades['ADJACENT']}건으로 분류했습니다."
    )


def _role_count(repository: InMemoryStore, gap_id: str, role_types: set[str]) -> int:
    count = 0
    for evidence in repository.list_gap_evidence(gap_id):
        roles = repository.list_gap_evidence_roles(evidence.id)
        if any(role.role_type in role_types for role in roles):
            count += 1
    return count
