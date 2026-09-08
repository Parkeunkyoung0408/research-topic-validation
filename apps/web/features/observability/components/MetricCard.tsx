import type { ObservabilityMetric } from "@research-topic-validation/contracts";
import { StatusBadge } from "./StatusBadge";

export function MetricCard({ metric }: { metric: ObservabilityMetric }) {
  return (
    <div className="metric-card">
      <span className="small-text">{metric.label}</span>
      <strong>{metric.value ?? "계산 안 함"}</strong>
      <StatusBadge value={metric.status} />
      {metric.note ? <span className="small-text">{metric.note}</span> : null}
    </div>
  );
}
