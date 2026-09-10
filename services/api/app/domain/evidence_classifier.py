from __future__ import annotations
from dataclasses import dataclass
import re

from app.domain.models import GapCondition, Paper


TOKEN_RE = re.compile(r"[a-zA-Z0-9가-힣]+")
MOTIVATING_TERMS = {"future", "further", "limitation", "gap", "need", "challenge", "향후", "한계", "필요"}
ENABLING_TERMS = {"dataset", "code", "benchmark", "framework", "method", "tool", "데이터", "코드", "벤치마크", "방법"}


@dataclass(frozen=True)
class EvidenceClassification:
    overlap_grade: str
    strength: float
    matched_conditions: list[str]
    mismatched_conditions: list[str]
    roles: list[tuple[str, float]]
    passage_text: str


def classify_gap_evidence(gap_text: str, conditions: list[GapCondition], paper: Paper) -> EvidenceClassification:
    target_text = f"{paper.title} {paper.abstract or ''}"
    gap_tokens = _tokens(gap_text)
    paper_tokens = _tokens(target_text)
    overlap = len(gap_tokens & paper_tokens) / max(len(gap_tokens), 1)

    matched_conditions: list[str] = []
    mismatched_conditions: list[str] = []
    for condition in conditions:
        condition_tokens = _tokens(condition.label)
        if condition_tokens and condition_tokens & paper_tokens:
            matched_conditions.append(condition.label)
        else:
            mismatched_conditions.append(condition.label)

    overlap_grade = _grade_overlap(overlap, matched_conditions, conditions)
    roles = _classify_roles(target_text, overlap_grade)
    passage_text = _pick_passage(paper)

    return EvidenceClassification(
        overlap_grade=overlap_grade,
        strength=round(overlap, 3),
        matched_conditions=matched_conditions,
        mismatched_conditions=mismatched_conditions,
        roles=roles,
        passage_text=passage_text,
    )


def _tokens(value: str) -> set[str]:
    stopwords = {"the", "and", "or", "of", "in", "on", "to", "a", "an", "for", "with", "by"}
    return {token.lower() for token in TOKEN_RE.findall(value) if len(token) > 2 and token.lower() not in stopwords}


def _grade_overlap(overlap: float, matched_conditions: list[str], conditions: list[GapCondition]) -> str:
    core_count = max(len([condition for condition in conditions if condition.role == "CORE"]), 1)
    condition_ratio = len(matched_conditions) / core_count
    if overlap >= 0.55 and condition_ratio >= 0.67:
        return "DIRECT"
    if overlap >= 0.32 or condition_ratio >= 0.34:
        return "P1"
    if overlap >= 0.16:
        return "P2"
    return "ADJACENT"


def _classify_roles(text: str, overlap_grade: str) -> list[tuple[str, float]]:
    lowered = text.lower()
    roles: list[tuple[str, float]] = []
    if overlap_grade in {"DIRECT", "P1"}:
        roles.append(("COUNTER", 0.72 if overlap_grade == "DIRECT" else 0.54))
    if any(term in lowered for term in MOTIVATING_TERMS):
        roles.append(("MOTIVATING", 0.62))
    if any(term in lowered for term in ENABLING_TERMS):
        roles.append(("ENABLING", 0.58))
    return roles or [("RELATED", 0.4)]


def _pick_passage(paper: Paper) -> str:
    if paper.abstract:
        return paper.abstract[:900]
    return paper.title
