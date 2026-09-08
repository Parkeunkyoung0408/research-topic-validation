import type {
  GapCondition,
  GateAssessmentInput,
  GapEvidenceList,
  GapHypothesis,
  GapReview,
  Project,
  ObservabilityDashboard,
  ResearcherDecision,
  ResearcherDecisionInput,
  ResearcherAnnotation,
  ResearcherAnnotationInput,
  RewriteOptionsResponse,
  SearchRun,
} from "@research-topic-validation/contracts";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`요청에 실패했습니다. 상태 코드: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function createProject(input: {
  title: string;
  description?: string;
}) {
  return request<Project>("/v1/projects", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function createGap(projectId: string, input: { gapText: string }) {
  return request<{ gap: GapHypothesis; conditions: GapCondition[] }>(
    `/v1/projects/${projectId}/gaps`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export async function runSearch(
  gapId: string,
  input: { query: string; limit?: number },
) {
  return request<SearchRun>(`/v1/gaps/${gapId}/search-runs`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getGapEvidence(gapId: string) {
  return request<GapEvidenceList>(`/v1/gaps/${gapId}/evidence`);
}

export async function getGapReview(gapId: string) {
  return request<GapReview>(`/v1/gaps/${gapId}/review`);
}

export async function assessGap(gapId: string, input: GateAssessmentInput) {
  return request<GapReview>(`/v1/gaps/${gapId}/assessments`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function createRewriteOptions(gapId: string) {
  return request<RewriteOptionsResponse>(`/v1/gaps/${gapId}/rewrite-options`, {
    method: "POST",
  });
}

export async function createResearcherDecision(
  gapId: string,
  input: ResearcherDecisionInput,
) {
  return request<ResearcherDecision>(`/v1/gaps/${gapId}/decisions`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getLatestObservabilityDashboard() {
  return request<ObservabilityDashboard>("/v1/observability/latest", {
    cache: "no-store",
  });
}

export async function createResearcherAnnotation(
  gapEvidenceId: string,
  input: ResearcherAnnotationInput,
) {
  return request<ResearcherAnnotation>(
    `/v1/gap-evidence/${gapEvidenceId}/annotations`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}
