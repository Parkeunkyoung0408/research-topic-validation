from app.domain.models import (
    EvidencePassage,
    GapCondition,
    GapEvidence,
    GapEvidencePassage,
    GapEvidenceRole,
    GapHypothesis,
    GateAssessment,
    Paper,
    PaperCoding,
    Project,
    ResearcherProfile,
    ResearcherDecision,
    ResearcherAnnotation,
    RewriteOption,
    SearchResult,
    SearchRun,
)


class InMemoryStore:
    def __init__(self) -> None:
        self.projects: dict[str, Project] = {}
        self.gaps: dict[str, GapHypothesis] = {}
        self.conditions: dict[str, GapCondition] = {}
        self.papers: dict[str, Paper] = {}
        self.search_runs: dict[str, SearchRun] = {}
        self.search_results: dict[str, SearchResult] = {}
        self.paper_codings: dict[str, PaperCoding] = {}
        self.evidence_passages: dict[str, EvidencePassage] = {}
        self.gap_evidence: dict[str, GapEvidence] = {}
        self.gap_evidence_roles: dict[str, GapEvidenceRole] = {}
        self.gap_evidence_passages: dict[str, GapEvidencePassage] = {}
        self.researcher_profiles: dict[str, ResearcherProfile] = {}
        self.gate_assessments: dict[str, GateAssessment] = {}
        self.rewrite_options: dict[str, RewriteOption] = {}
        self.researcher_decisions: dict[str, ResearcherDecision] = {}
        self.researcher_annotations: dict[str, ResearcherAnnotation] = {}

    def add_project(self, project: Project) -> Project:
        self.projects[project.id] = project
        return project

    def get_project(self, project_id: str) -> Project | None:
        return self.projects.get(project_id)

    def add_gap(self, gap: GapHypothesis) -> GapHypothesis:
        self.gaps[gap.id] = gap
        return gap

    def get_gap(self, gap_id: str) -> GapHypothesis | None:
        return self.gaps.get(gap_id)

    def replace_conditions(self, gap_id: str, conditions: list[GapCondition]) -> list[GapCondition]:
        self.conditions = {key: value for key, value in self.conditions.items() if value.gap_id != gap_id}
        for condition in conditions:
            self.conditions[condition.id] = condition
        return conditions

    def list_conditions(self, gap_id: str) -> list[GapCondition]:
        return sorted(
            [condition for condition in self.conditions.values() if condition.gap_id == gap_id],
            key=lambda item: item.sort_order,
        )

    def upsert_paper(self, paper: Paper) -> Paper:
        if paper.openalex_id:
            for existing in self.papers.values():
                if existing.openalex_id == paper.openalex_id:
                    return existing
        self.papers[paper.id] = paper
        return paper

    def add_search_run(self, search_run: SearchRun) -> SearchRun:
        self.search_runs[search_run.id] = search_run
        return search_run

    def get_search_run(self, search_run_id: str) -> SearchRun | None:
        return self.search_runs.get(search_run_id)

    def add_search_result(self, result: SearchResult) -> SearchResult:
        self.search_results[result.id] = result
        return result

    def list_search_results(self, search_run_id: str) -> list[SearchResult]:
        return sorted(
            [result for result in self.search_results.values() if result.search_run_id == search_run_id],
            key=lambda item: item.rank,
        )

    def get_paper(self, paper_id: str) -> Paper | None:
        return self.papers.get(paper_id)

    def upsert_paper_coding(self, coding: PaperCoding) -> PaperCoding:
        for existing in self.paper_codings.values():
            if existing.paper_id == coding.paper_id and existing.coding_schema_version == coding.coding_schema_version:
                return existing
        self.paper_codings[coding.id] = coding
        return coding

    def add_evidence_passage(self, passage: EvidencePassage) -> EvidencePassage:
        self.evidence_passages[passage.id] = passage
        return passage

    def add_gap_evidence(self, evidence: GapEvidence) -> GapEvidence:
        self.gap_evidence[evidence.id] = evidence
        return evidence

    def add_gap_evidence_role(self, role: GapEvidenceRole) -> GapEvidenceRole:
        self.gap_evidence_roles[role.id] = role
        return role

    def add_gap_evidence_passage(self, link: GapEvidencePassage) -> GapEvidencePassage:
        self.gap_evidence_passages[link.id] = link
        return link

    def list_gap_evidence(self, gap_id: str) -> list[GapEvidence]:
        return [item for item in self.gap_evidence.values() if item.gap_id == gap_id]

    def list_gap_evidence_roles(self, gap_evidence_id: str) -> list[GapEvidenceRole]:
        return [item for item in self.gap_evidence_roles.values() if item.gap_evidence_id == gap_evidence_id]

    def list_gap_evidence_passages(self, gap_evidence_id: str) -> list[EvidencePassage]:
        passage_ids = [
            link.passage_id
            for link in self.gap_evidence_passages.values()
            if link.gap_evidence_id == gap_evidence_id
        ]
        return [self.evidence_passages[passage_id] for passage_id in passage_ids if passage_id in self.evidence_passages]

    def add_researcher_profile(self, profile: ResearcherProfile) -> ResearcherProfile:
        self.researcher_profiles[profile.id] = profile
        return profile

    def add_gate_assessment(self, assessment: GateAssessment) -> GateAssessment:
        self.gate_assessments[assessment.id] = assessment
        return assessment

    def list_gate_assessments(self, gap_id: str) -> list[GateAssessment]:
        return sorted(
            [item for item in self.gate_assessments.values() if item.gap_id == gap_id],
            key=lambda item: item.created_at,
        )

    def latest_gate_assessment(self, gap_id: str, gate_type: str) -> GateAssessment | None:
        matches = [item for item in self.list_gate_assessments(gap_id) if item.gate_type == gate_type]
        return matches[-1] if matches else None

    def replace_rewrite_options(self, gap_id: str, options: list[RewriteOption]) -> list[RewriteOption]:
        self.rewrite_options = {key: value for key, value in self.rewrite_options.items() if value.gap_id != gap_id}
        for option in options:
            self.rewrite_options[option.id] = option
        return options

    def list_rewrite_options(self, gap_id: str) -> list[RewriteOption]:
        return sorted(
            [item for item in self.rewrite_options.values() if item.gap_id == gap_id],
            key=lambda item: item.created_at,
        )

    def get_rewrite_option(self, option_id: str) -> RewriteOption | None:
        return self.rewrite_options.get(option_id)

    def add_researcher_decision(self, decision: ResearcherDecision) -> ResearcherDecision:
        self.researcher_decisions[decision.id] = decision
        return decision

    def list_researcher_decisions(self, gap_id: str) -> list[ResearcherDecision]:
        return sorted(
            [item for item in self.researcher_decisions.values() if item.gap_id == gap_id],
            key=lambda item: item.created_at,
        )

    def add_researcher_annotation(self, annotation: ResearcherAnnotation) -> ResearcherAnnotation:
        self.researcher_annotations[annotation.id] = annotation
        return annotation

    def list_researcher_annotations(self, gap_evidence_id: str | None = None) -> list[ResearcherAnnotation]:
        values = list(self.researcher_annotations.values())
        if gap_evidence_id:
            values = [item for item in values if item.gap_evidence_id == gap_evidence_id]
        return sorted(values, key=lambda item: item.created_at)

    def latest_gap(self) -> GapHypothesis | None:
        if not self.gaps:
            return None
        return sorted(self.gaps.values(), key=lambda item: item.created_at)[-1]


store = InMemoryStore()
