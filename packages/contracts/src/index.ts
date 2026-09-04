export type Project = {
  id: string;
  title: string;
  description?: string | null;
  createdAt: string;
};

export type GapHypothesis = {
  id: string;
  projectId: string;
  gapText: string;
  status: string;
  createdAt: string;
};

export type GapCondition = {
  id: string;
  gapId: string;
  label: string;
  role: "CORE" | "PERIPHERAL";
  mechanism?: string | null;
  justification?: string | null;
  isLoadBearing: boolean;
  sortOrder: number;
};

export type Paper = {
  id: string;
  title: string;
  doi?: string | null;
  openalexId?: string | null;
  publicationYear?: number | null;
  language?: string | null;
  documentType?: string | null;
  oaStatus?: string | null;
};

export type SearchRun = {
  id: string;
  gapId: string;
  sourceScope: Record<string, unknown>;
  querySnapshot: Record<string, unknown>;
  resultCount: number;
  createdAt: string;
  results: Array<{
    id: string;
    paper: Paper;
    source: string;
    rank: number;
    score?: number | null;
  }>;
};

export type EvidenceRole = {
  roleType: string;
  confidence: number;
};

export type EvidencePassage = {
  id: string;
  paperId: string;
  passageText: string;
  section?: string | null;
};

export type GapEvidence = {
  id: string;
  gapId: string;
  paper: Paper;
  overlapGrade: "DIRECT" | "P1" | "P2" | "ADJACENT";
  strength: number;
  matchedConditions: string[];
  mismatchedConditions: string[];
  roles: EvidenceRole[];
  passages: EvidencePassage[];
};

export type GapEvidenceList = {
  gapId: string;
  items: GapEvidence[];
};

export type GateReview = {
  gateType: "EXISTENCE" | "VALUE" | "FEASIBILITY";
  status: string;
  grade?: string | null;
  rationale: string;
  evidenceCount: number;
};

export type GapReview = {
  gapId: string;
  gates: GateReview[];
};

export type GateAssessmentInput = {
  searchRunId?: string | null;
  decisionLink?: string | null;
  availableData?: string | null;
  participants?: string | null;
  tools?: string | null;
  timeBudget?: string | null;
  collaboration?: string | null;
  notes?: string | null;
};

export type RewriteOption = {
  id: string;
  gapId: string;
  action: "PROCEED" | "HOLD" | "REFRAME" | "DIFFERENTIATE" | "REJECT";
  title: string;
  rewrittenGapText: string;
  rationale: string;
  createdAt: string;
};

export type RewriteOptionsResponse = {
  gapId: string;
  options: RewriteOption[];
};

export type ResearcherDecisionInput = {
  action: string;
  rewriteOptionId?: string | null;
  rationale?: string | null;
  reverify?: boolean;
};

export type ResearcherDecision = {
  id: string;
  gapId: string;
  action: string;
  rewriteOptionId?: string | null;
  newGapId?: string | null;
  rationale?: string | null;
  createdAt: string;
};

export type ResearcherAnnotation = {
  id: string;
  gapEvidenceId: string;
  relevanceLabel: string;
  relationLabel: string;
  notes?: string | null;
  createdAt: string;
};

export type ObservabilityMetric = {
  label: string;
  value?: number | string | null;
  status: string;
  note?: string | null;
};

export type ObservabilityTimelineEvent = {
  label: string;
  status: string;
  detail: string;
};

export type EvidenceQualityItem = {
  gapEvidenceId: string;
  aiEvidenceClaim?: string | null;
  originalEvidencePassage: string;
  paper: Paper;
  source: string;
  citationMatch: string;
  groundingStatus: string;
  unsupportedClaim: string;
  evidenceRelation: string;
  annotations: ResearcherAnnotation[];
};

export type DecisionQualityItem = {
  gateType: "EXISTENCE" | "VALUE" | "FEASIBILITY";
  aiAssessment: string;
  evidenceIds: string[];
  researcherDecision?: string | null;
  researcherOverride?: boolean | null;
  decision?: string | null;
};

export type ObservabilityDashboard = {
  gapId?: string | null;
  overview: ObservabilityMetric[];
  searchQuality: {
    originalQuery?: string | null;
    rewrittenQuery?: string | null;
    searchedPaperCount?: number | null;
    rerankedPaperCount?: number | null;
    coreConditionEvidenceCoverage?: Array<{
      condition: string;
      role: string;
      evidenceCount: number;
      status: string;
    }>;
    queryRewriteReason?: string | null;
    newEvidenceAfterRewrite?: number | null;
    counterEvidenceCount?: number | null;
    evaluationLayer?: {
      interfaceReady: boolean;
      metrics: string[];
      status: string;
    };
  };
  searchTimeline: ObservabilityTimelineEvent[];
  evidenceQuality: EvidenceQualityItem[];
  decisionQuality: DecisionQualityItem[];
  evaluationDataset: {
    annotations: ResearcherAnnotation[];
    goldSetStatus: string;
    note?: string;
  };
  unavailableMetrics: ObservabilityMetric[];
};

export type ResearcherAnnotationInput = {
  relevanceLabel: "RELEVANT" | "NOT_RELEVANT";
  relationLabel: "COUNTER_EVIDENCE" | "SUPPORTING" | "OTHER";
  notes?: string | null;
};
