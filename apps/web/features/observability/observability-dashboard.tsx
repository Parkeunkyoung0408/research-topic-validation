"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import type { EvidenceQualityItem, ObservabilityDashboard, ResearcherAnnotationInput } from "@research-topic-validation/contracts";
import { createResearcherAnnotation, getLatestObservabilityDashboard } from "../../lib/api";

type View = "Overview" | "Search Quality" | "Evidence Quality" | "Decision Quality" | "Evaluation Dataset";

const views: View[] = ["Overview", "Search Quality", "Evidence Quality", "Decision Quality", "Evaluation Dataset"];

export function ObservabilityDashboardPage() {
  const [activeView, setActiveView] = useState<View>("Overview");
  const [dashboard, setDashboard] = useState<ObservabilityDashboard | null>(null);
  const [message, setMessage] = useState("관측 데이터를 불러오는 중입니다.");
  const [isPending, startTransition] = useTransition();

  async function loadDashboard() {
    const nextDashboard = await getLatestObservabilityDashboard();
    setDashboard(nextDashboard);
    setMessage(nextDashboard.gapId ? "최근 Gap 검증 실행을 기준으로 표시합니다." : "아직 검증 실행 데이터가 없습니다.");
  }

  useEffect(() => {
    loadDashboard().catch((error) => {
      setMessage(error instanceof Error ? error.message : "대시보드 로드에 실패했습니다.");
    });
  }, []);

  function annotate(gapEvidenceId: string, input: ResearcherAnnotationInput) {
    startTransition(async () => {
      try {
        await createResearcherAnnotation(gapEvidenceId, input);
        await loadDashboard();
        setMessage("Annotation을 저장했습니다. 이 데이터는 향후 Gold Set 후보로 사용됩니다.");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Annotation 저장에 실패했습니다.");
      }
    });
  }

  return (
    <main className="observability-shell">
      <aside className="observability-sidebar">
        <div>
          <h1 className="observability-title">Evidence Pipeline Observability</h1>
          <p className="small-text">Search → Evidence → Decision 추적</p>
        </div>
        <nav className="observability-nav" aria-label="Observability views">
          {views.map((view) => (
            <button
              className={`nav-item ${activeView === view ? "active" : ""}`}
              key={view}
              type="button"
              onClick={() => setActiveView(view)}
            >
              {view}
            </button>
          ))}
        </nav>
        <a className="nav-link" href="/">
          검증 화면으로 이동
        </a>
      </aside>

      <section className="observability-main">
        <header className="observability-header">
          <div>
            <h2>{activeView}</h2>
            <p className="small-text">{message}</p>
          </div>
          <button className="button secondary-button" type="button" disabled={isPending} onClick={() => loadDashboard()}>
            새로고침
          </button>
        </header>

        {dashboard ? (
          <>
            {activeView === "Overview" ? <OverviewView dashboard={dashboard} /> : null}
            {activeView === "Search Quality" ? <SearchQualityView dashboard={dashboard} /> : null}
            {activeView === "Evidence Quality" ? <EvidenceQualityView items={dashboard.evidenceQuality} onAnnotate={annotate} /> : null}
            {activeView === "Decision Quality" ? <DecisionQualityView dashboard={dashboard} /> : null}
            {activeView === "Evaluation Dataset" ? <EvaluationDatasetView dashboard={dashboard} onAnnotate={annotate} /> : null}
          </>
        ) : (
          <div className="empty">대시보드를 불러오고 있습니다.</div>
        )}
      </section>
    </main>
  );
}

function OverviewView({ dashboard }: { dashboard: ObservabilityDashboard }) {
  return (
    <div className="observability-stack">
      <div className="metric-grid">
        {dashboard.overview.map((metric) => (
          <MetricCard metric={metric} key={metric.label} />
        ))}
      </div>
      <div className="quality-strip">
        <QualityStatus title="Search" status={dashboard.searchQuality.originalQuery ? "로그 있음" : "대기"} />
        <QualityStatus title="Evidence" status={`${dashboard.evidenceQuality.length}건`} />
        <QualityStatus title="Decision" status={`${dashboard.decisionQuality.length}건`} />
      </div>
      <UnavailableMetrics metrics={dashboard.unavailableMetrics} />
    </div>
  );
}

function SearchQualityView({ dashboard }: { dashboard: ObservabilityDashboard }) {
  const quality = dashboard.searchQuality;
  return (
    <div className="observability-stack">
      <div className="two-column">
        <InfoPanel title="Original Query" value={quality.originalQuery ?? "검색 실행 없음"} />
        <InfoPanel title="Rewritten Query" value={quality.rewrittenQuery ?? "Query Rewrite 미실행"} />
        <InfoPanel title="검색된 논문 수" value={String(quality.searchedPaperCount ?? 0)} />
        <InfoPanel title="Rerank된 논문 수" value={quality.rerankedPaperCount == null ? "Reranker 로그 없음" : String(quality.rerankedPaperCount)} />
        <InfoPanel title="Query Rewrite 발생 이유" value={quality.queryRewriteReason ?? "기록 없음"} />
        <InfoPanel title="Rewrite 전후 새 Evidence 수" value={quality.newEvidenceAfterRewrite == null ? "Rewrite 미실행" : String(quality.newEvidenceAfterRewrite)} />
        <InfoPanel title="Counter Evidence 발견 수" value={String(quality.counterEvidenceCount ?? 0)} />
      </div>

      <section className="observability-card">
        <h3>Core Condition별 Evidence Coverage</h3>
        <div className="coverage-list">
          {(quality.coreConditionEvidenceCoverage ?? []).map((item) => (
            <div className="coverage-row" key={item.condition}>
              <span>{item.condition}</span>
              <span>{item.role}</span>
              <span>{item.evidenceCount}건</span>
              <StatusBadge value={item.status} />
            </div>
          ))}
          {!(quality.coreConditionEvidenceCoverage ?? []).length ? <p className="small-text">조건 coverage 데이터가 없습니다.</p> : null}
        </div>
      </section>

      <section className="observability-card">
        <h3>Search Timeline</h3>
        <div className="timeline">
          {dashboard.searchTimeline.map((event) => (
            <div className="timeline-item" key={event.label}>
              <StatusBadge value={event.status} />
              <strong>{event.label}</strong>
              <span className="small-text">{event.detail}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function EvidenceQualityView({
  items,
  onAnnotate
}: {
  items: EvidenceQualityItem[];
  onAnnotate: (gapEvidenceId: string, input: ResearcherAnnotationInput) => void;
}) {
  return (
    <div className="observability-stack">
      {items.map((item) => (
        <section className="observability-card" key={item.gapEvidenceId}>
          <div className="evidence-compare">
            <div>
              <h3>AI Evidence Claim</h3>
              <p>{item.aiEvidenceClaim ?? "AI claim 저장 없음"}</p>
            </div>
            <div>
              <h3>Original Evidence Passage</h3>
              <p>{item.originalEvidencePassage || "원문 passage 없음"}</p>
            </div>
          </div>
          <div className="meta">
            <span>{item.paper.title}</span>
            <span>{item.source}</span>
            <span>Citation: {statusKorean(item.citationMatch)}</span>
            <span>Grounding: {statusKorean(item.groundingStatus)}</span>
            <span>Unsupported: {statusKorean(item.unsupportedClaim)}</span>
            <span>Relation: {item.evidenceRelation}</span>
          </div>
          <AnnotationControls gapEvidenceId={item.gapEvidenceId} onAnnotate={onAnnotate} />
        </section>
      ))}
      {!items.length ? <div className="empty">Evidence 데이터가 없습니다. 먼저 검증을 실행하세요.</div> : null}
    </div>
  );
}

function DecisionQualityView({ dashboard }: { dashboard: ObservabilityDashboard }) {
  return (
    <div className="observability-stack">
      {dashboard.decisionQuality.map((item) => (
        <section className="observability-card" key={`${item.gateType}-${item.aiAssessment}`}>
          <h3>{gateKorean(item.gateType)}</h3>
          <p>{item.aiAssessment}</p>
          <div className="meta">
            <span>근거 Evidence {item.evidenceIds.length}건</span>
            <span>Researcher Decision: {item.researcherDecision ? decisionKorean(item.researcherDecision) : "미기록"}</span>
            <span>Override: {item.researcherOverride == null ? "미검증" : item.researcherOverride ? "있음" : "없음"}</span>
          </div>
        </section>
      ))}
      {!dashboard.decisionQuality.length ? <div className="empty">Gate Assessment 데이터가 없습니다.</div> : null}
    </div>
  );
}

function EvaluationDatasetView({
  dashboard,
  onAnnotate
}: {
  dashboard: ObservabilityDashboard;
  onAnnotate: (gapEvidenceId: string, input: ResearcherAnnotationInput) => void;
}) {
  const annotatedIds = useMemo(
    () => new Set(dashboard.evaluationDataset.annotations.map((item) => item.gapEvidenceId)),
    [dashboard.evaluationDataset.annotations],
  );

  return (
    <div className="observability-stack">
      <section className="observability-card">
        <h3>Gold Set 준비 상태</h3>
        <p className="small-text">{dashboard.evaluationDataset.note ?? "Gold Set은 아직 구축되지 않았습니다."}</p>
        <p className="small-text">저장된 annotation {dashboard.evaluationDataset.annotations.length}건</p>
      </section>
      {dashboard.evidenceQuality.map((item) => (
        <section className="observability-card" key={item.gapEvidenceId}>
          <h3>{item.paper.title}</h3>
          <p className="evidence-summary">{item.originalEvidencePassage}</p>
          <StatusBadge value={annotatedIds.has(item.gapEvidenceId) ? "annotated" : "needs_annotation"} />
          <AnnotationControls gapEvidenceId={item.gapEvidenceId} onAnnotate={onAnnotate} />
        </section>
      ))}
    </div>
  );
}

function AnnotationControls({
  gapEvidenceId,
  onAnnotate
}: {
  gapEvidenceId: string;
  onAnnotate: (gapEvidenceId: string, input: ResearcherAnnotationInput) => void;
}) {
  const [relevanceLabel, setRelevanceLabel] = useState<ResearcherAnnotationInput["relevanceLabel"]>("RELEVANT");
  const [relationLabel, setRelationLabel] = useState<ResearcherAnnotationInput["relationLabel"]>("SUPPORTING");

  return (
    <div className="annotation-row">
      <select value={relevanceLabel} onChange={(event) => setRelevanceLabel(event.target.value as ResearcherAnnotationInput["relevanceLabel"])}>
        <option value="RELEVANT">Relevant</option>
        <option value="NOT_RELEVANT">Not Relevant</option>
      </select>
      <select value={relationLabel} onChange={(event) => setRelationLabel(event.target.value as ResearcherAnnotationInput["relationLabel"])}>
        <option value="COUNTER_EVIDENCE">Counter Evidence</option>
        <option value="SUPPORTING">Supporting</option>
        <option value="OTHER">Other</option>
      </select>
      <button className="button secondary-button" type="button" onClick={() => onAnnotate(gapEvidenceId, { relevanceLabel, relationLabel })}>
        Annotation 저장
      </button>
    </div>
  );
}

function MetricCard({ metric }: { metric: ObservabilityDashboard["overview"][number] }) {
  return (
    <div className="metric-card">
      <span className="small-text">{metric.label}</span>
      <strong>{metric.value ?? "계산 안 함"}</strong>
      <StatusBadge value={metric.status} />
      {metric.note ? <span className="small-text">{metric.note}</span> : null}
    </div>
  );
}

function QualityStatus({ title, status }: { title: string; status: string }) {
  return (
    <div className="quality-status">
      <strong>{title}</strong>
      <span>{status}</span>
    </div>
  );
}

function InfoPanel({ title, value }: { title: string; value: string }) {
  return (
    <section className="observability-card">
      <h3>{title}</h3>
      <p>{value}</p>
    </section>
  );
}

function UnavailableMetrics({ metrics }: { metrics: ObservabilityDashboard["unavailableMetrics"] }) {
  return (
    <section className="observability-card">
      <h3>Evaluation Layer Interface</h3>
      <div className="metric-list">
        {metrics.map((metric) => (
          <div className="coverage-row" key={metric.label}>
            <span>{metric.label}</span>
            <span>{metric.value ?? "값 없음"}</span>
            <StatusBadge value={metric.status} />
          </div>
        ))}
      </div>
    </section>
  );
}

function StatusBadge({ value }: { value: string }) {
  return <span className="status-badge">{statusKorean(value)}</span>;
}

function statusKorean(value: string) {
  const labels: Record<string, string> = {
    available: "사용 가능",
    not_available: "미구현",
    gold_set_required: "Gold Set 필요",
    verification_required: "검증 데이터 필요",
    annotation_required: "Annotation 필요",
    done: "완료",
    pending: "대기",
    not_detected: "감지 안 됨",
    not_run: "미실행",
    not_verified: "미검증",
    covered: "Coverage 있음",
    not_covered: "Coverage 없음",
    annotated: "Annotation 있음",
    needs_annotation: "Annotation 필요"
  };
  return labels[value] ?? value;
}

function gateKorean(value: string) {
  const labels: Record<string, string> = {
    EXISTENCE: "Existence",
    VALUE: "Value",
    FEASIBILITY: "Feasibility"
  };
  return labels[value] ?? value;
}

function decisionKorean(value: string) {
  const labels: Record<string, string> = {
    PROCEED: "PROCEED",
    HOLD: "HOLD",
    REFRAME: "MODIFY",
    DIFFERENTIATE: "MODIFY",
    REJECT: "REJECT"
  };
  return labels[value] ?? value;
}
