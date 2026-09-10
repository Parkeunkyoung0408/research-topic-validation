from __future__ import annotations
from app.domain.models import GapCondition


def infer_initial_conditions(gap_id: str, gap_text: str) -> list[GapCondition]:
    words = [word.strip(" ,.;:()[]{}").lower() for word in gap_text.split()]
    candidates: list[tuple[str, str]] = []

    if "long-term" in words or "longterm" in words:
        candidates.append(("Duration: long-term", "CORE"))
    if "actual" in words or "field" in words or "work" in words:
        candidates.append(("Context: actual work", "CORE"))
    if "generative" in words or "ai" in words:
        candidates.append(("Technology: generative AI", "CORE"))

    if not candidates:
        candidates.append(("User-confirmed core condition required", "CORE"))

    return [
        GapCondition(
            gap_id=gap_id,
            label=label,
            role=role,
            mechanism=None,
            justification="Initial heuristic extraction. Researcher confirmation required.",
            sort_order=index,
        )
        for index, (label, role) in enumerate(candidates, start=1)
    ]
