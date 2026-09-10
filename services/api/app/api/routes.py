from __future__ import annotations
from fastapi import APIRouter, HTTPException, status

from app.repositories.in_memory import store
from app.schemas.requests import (
    CreateGapRequest,
    CreateProjectRequest,
    CreateResearcherDecisionRequest,
    CreateResearcherAnnotationRequest,
    RunGateAssessmentRequest,
    RunSearchRequest,
)
from app.schemas.responses import GapCreateResponse, ProjectResponse, SearchRunResponse
from app.services.project_service import ProjectService
from app.services.search_service import SearchService
from app.services.evidence_service import EvidenceService
from app.services.gate_service import GateService
from app.services.decision_service import DecisionService
from app.services.observability_service import ObservabilityService

router = APIRouter()
project_service = ProjectService(store)
search_service = SearchService(store)
evidence_service = EvidenceService(store)
gate_service = GateService(store)
decision_service = DecisionService(store)
observability_service = ObservabilityService(store)


@router.post("/projects", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(payload: CreateProjectRequest) -> ProjectResponse:
    return project_service.create_project(payload)


@router.post("/projects/{project_id}/gaps", response_model=GapCreateResponse, status_code=status.HTTP_201_CREATED)
def create_gap(project_id: str, payload: CreateGapRequest) -> GapCreateResponse:
    try:
        return project_service.create_gap(project_id, payload)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.patch("/gaps/{gap_id}/conditions", response_model=GapCreateResponse)
def update_gap_conditions(gap_id: str, payload: list[dict[str, object]]) -> GapCreateResponse:
    try:
        return project_service.replace_conditions(gap_id, payload)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/gaps/{gap_id}/search-runs", response_model=SearchRunResponse, status_code=status.HTTP_202_ACCEPTED)
async def run_search(gap_id: str, payload: RunSearchRequest) -> SearchRunResponse:
    try:
        return await search_service.run_openalex_search(gap_id, payload)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/search-runs/{search_run_id}", response_model=SearchRunResponse)
def get_search_run(search_run_id: str) -> SearchRunResponse:
    try:
        return search_service.get_search_run(search_run_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/gaps/{gap_id}/evidence")
def list_gap_evidence(gap_id: str) -> dict[str, object]:
    try:
        return {"gapId": gap_id, "items": evidence_service.list_gap_evidence(gap_id)}
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/gaps/{gap_id}/review")
def get_gap_review(gap_id: str):
    try:
        return evidence_service.get_gap_review(gap_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/gaps/{gap_id}/assessments")
def assess_gap(gap_id: str, payload: RunGateAssessmentRequest):
    try:
        return gate_service.assess_gap(gap_id, payload)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/gaps/{gap_id}/rewrite-options")
def create_rewrite_options(gap_id: str):
    try:
        return decision_service.generate_rewrite_options(gap_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/gaps/{gap_id}/decisions")
def create_researcher_decision(gap_id: str, payload: CreateResearcherDecisionRequest):
    try:
        return decision_service.create_decision(gap_id, payload)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/observability/latest")
def get_latest_observability_dashboard():
    return observability_service.get_latest_dashboard()


@router.get("/observability/gaps/{gap_id}")
def get_observability_dashboard(gap_id: str):
    try:
        return observability_service.get_dashboard(gap_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/gap-evidence/{gap_evidence_id}/annotations")
def create_researcher_annotation(gap_evidence_id: str, payload: CreateResearcherAnnotationRequest):
    try:
        return observability_service.create_annotation(gap_evidence_id, payload)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
