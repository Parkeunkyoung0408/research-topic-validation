import type { ObservabilityDashboard } from "@research-topic-validation/contracts";
import { InfoPanel } from "../components/InfoPanel";
import { StatusBadge } from "../components/StatusBadge";
import { localizeSystemText } from "../labels";

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
          title="실제 검색어"
          value={quality.originalQuery ?? "검색 실행 없음"}
        />
        <InfoPanel
          title="수정된 검색어"
          value={quality.rewrittenQuery ?? "검색어 자동 수정 미실행"}
        />
        <InfoPanel
          title="검색된 논문 수"
          value={String(quality.searchedPaperCount ?? 0)}
        />
        <InfoPanel
          title="순위 재정렬 논문 수"
          value={
            quality.rerankedPaperCount == null
              ? "순위 재정렬 기록 없음"
              : String(quality.rerankedPaperCount)
          }
        />
        <InfoPanel
          title="검색어 수정 이유"
          value={quality.queryRewriteReason ?? "기록 없음"}
        />
        <InfoPanel
          title="검색어 수정 후 추가된 근거 수"
          value={
            quality.newEvidenceAfterRewrite == null
              ? "검색어 수정 전후 비교 미집계"
              : String(quality.newEvidenceAfterRewrite)
          }
        />
        <InfoPanel
          title="연구 공백에 대한 반대 근거 후보 수"
          value={String(quality.counterEvidenceCount ?? 0)}
        />
      </div>
      <section className="observability-card">
        <h3>연구 조건별 연결된 근거</h3>
        <div className="coverage-list">
          {(quality.coreConditionEvidenceCoverage ?? []).map((item) => (
            <div className="coverage-row" key={item.condition}>
              <span>{localizeSystemText(item.condition)}</span>
              <span>{localizeSystemText(item.role)}</span>
              <span>{item.evidenceCount}건</span>
              <StatusBadge value={item.status} />
            </div>
          ))}
          {!(quality.coreConditionEvidenceCoverage ?? []).length ? (
            <p className="small-text">연구 조건별 근거 연결 기록이 없습니다.</p>
          ) : null}
        </div>
      </section>
      <section className="observability-card">
        <h3>검색 단계 상태 요약</h3>
        <p className="small-text">
          저장된 데이터로 추정한 단계 상태입니다. 실행 시각이나 오류를 기록한
          로그는 아닙니다.
        </p>
        <div className="timeline">
          {dashboard.searchTimeline.map((event) => (
            <div className="timeline-item" key={event.label}>
              <StatusBadge value={event.status} />
              <strong>{localizeSystemText(event.label)}</strong>
              <span className="small-text">
                {localizeSystemText(event.detail)}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
