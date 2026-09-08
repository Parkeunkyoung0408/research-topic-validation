import type { ObservabilityDashboard } from "@research-topic-validation/contracts";
import { InfoPanel } from "../components/InfoPanel";
import { StatusBadge } from "../components/StatusBadge";

export function SearchQualityView({
  dashboard,
}: {
  dashboard: ObservabilityDashboard;
}) {
  const quality = dashboard.searchQuality;
  return (
    <div className="observability-stack">
      <div className="two-column">
        <InfoPanel
          title="Original Query"
          value={quality.originalQuery ?? "검색 실행 없음"}
        />
        <InfoPanel
          title="Rewritten Query"
          value={quality.rewrittenQuery ?? "Query Rewrite 미실행"}
        />
        <InfoPanel
          title="검색된 논문 수"
          value={String(quality.searchedPaperCount ?? 0)}
        />
        <InfoPanel
          title="Rerank된 논문 수"
          value={
            quality.rerankedPaperCount == null
              ? "Reranker 로그 없음"
              : String(quality.rerankedPaperCount)
          }
        />
        <InfoPanel
          title="Query Rewrite 발생 이유"
          value={quality.queryRewriteReason ?? "기록 없음"}
        />
        <InfoPanel
          title="Rewrite 전후 새 Evidence 수"
          value={
            quality.newEvidenceAfterRewrite == null
              ? "Rewrite 미실행"
              : String(quality.newEvidenceAfterRewrite)
          }
        />
        <InfoPanel
          title="Counter Evidence 발견 수"
          value={String(quality.counterEvidenceCount ?? 0)}
        />
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
          {!(quality.coreConditionEvidenceCoverage ?? []).length ? (
            <p className="small-text">조건 coverage 데이터가 없습니다.</p>
          ) : null}
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
