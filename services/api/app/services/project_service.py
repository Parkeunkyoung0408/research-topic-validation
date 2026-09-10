from __future__ import annotations
from app.domain.gap_structuring import infer_initial_conditions
from app.domain.models import GapCondition, GapHypothesis, Project
from app.repositories.in_memory import InMemoryStore
from app.schemas.requests import CreateGapRequest, CreateProjectRequest
from app.schemas.responses import GapCreateResponse, GapHypothesisResponse, ProjectResponse


class ProjectService:
    def __init__(self, repository: InMemoryStore) -> None:
        self.repository = repository

    def create_project(self, payload: CreateProjectRequest) -> ProjectResponse:
        project = self.repository.add_project(Project(title=payload.title, description=payload.description))
        return ProjectResponse.model_validate(project.__dict__)

    def create_gap(self, project_id: str, payload: CreateGapRequest) -> GapCreateResponse:
        if not self.repository.get_project(project_id):
            raise KeyError(f"Project not found: {project_id}")

        gap = self.repository.add_gap(GapHypothesis(project_id=project_id, gap_text=payload.gap_text))
        conditions = self.repository.replace_conditions(gap.id, infer_initial_conditions(gap.id, gap.gap_text))
        return self._gap_response(gap, conditions)

    def replace_conditions(self, gap_id: str, raw_conditions: list[dict[str, object]]) -> GapCreateResponse:
        gap = self.repository.get_gap(gap_id)
        if not gap:
            raise KeyError(f"Gap not found: {gap_id}")

        conditions = [
            GapCondition(
                gap_id=gap_id,
                label=str(item.get("label", "")),
                role=str(item.get("role", "CORE")),
                mechanism=item.get("mechanism") if isinstance(item.get("mechanism"), str) else None,
                justification=item.get("justification") if isinstance(item.get("justification"), str) else None,
                is_load_bearing=bool(item.get("isLoadBearing", False)),
                sort_order=index,
            )
            for index, item in enumerate(raw_conditions, start=1)
            if item.get("label")
        ]
        return self._gap_response(gap, self.repository.replace_conditions(gap_id, conditions))

    def _gap_response(self, gap: GapHypothesis, conditions: list[GapCondition]) -> GapCreateResponse:
        return GapCreateResponse(
            gap=GapHypothesisResponse.model_validate(gap.__dict__),
            conditions=[condition.__dict__ for condition in conditions],
        )
