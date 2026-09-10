import type { ObservabilityDashboard } from "@research-topic-validation/contracts";
import { MetricCard } from "../components/MetricCard";
import { StatusBadge } from "../components/StatusBadge";
import { localizeSystemText } from "../labels";

export function OverviewView({
  dashboard,
}: {
  dashboard: ObservabilityDashboard;
}) {
  return (
    <div className="observability-stack">
      <div className="metric-grid">
        {dashboard.overview.map((metric) => (
          <MetricCard metric={metric} key={metric.label} />
        ))}
      </div>
      <div className="quality-strip">
        <QualityStatus
          title="검색 기록"
          status={dashboard.searchQuality.originalQuery ? "로그 있음" : "대기"}
        />
        <QualityStatus
          title="논문 근거"
          status={`${dashboard.evidenceQuality.length}건`}
        />
        <QualityStatus
          title="판단 기록"
          status={`${dashboard.decisionQuality.length}건`}
        />
      </div>
      <section className="observability-card">
        <h3>아직 계산하지 않는 품질 지표</h3>
        <div className="metric-list">
          {dashboard.unavailableMetrics.map((metric) => (
            <div className="coverage-row" key={metric.label}>
              <span>{localizeSystemText(metric.label)}</span>
              <span>{metric.value ?? "값 없음"}</span>
              <StatusBadge value={metric.status} />
            </div>
          ))}
        </div>
      </section>
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
