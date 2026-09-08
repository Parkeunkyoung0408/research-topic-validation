import type { ObservabilityDashboard } from "@research-topic-validation/contracts";
import { MetricCard } from "../components/MetricCard";
import { StatusBadge } from "../components/StatusBadge";

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
          title="Search"
          status={dashboard.searchQuality.originalQuery ? "로그 있음" : "대기"}
        />
        <QualityStatus
          title="Evidence"
          status={`${dashboard.evidenceQuality.length}건`}
        />
        <QualityStatus
          title="Decision"
          status={`${dashboard.decisionQuality.length}건`}
        />
      </div>
      <section className="observability-card">
        <h3>Evaluation Layer Interface</h3>
        <div className="metric-list">
          {dashboard.unavailableMetrics.map((metric) => (
            <div className="coverage-row" key={metric.label}>
              <span>{metric.label}</span>
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
