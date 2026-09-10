import type { ObservabilityMetric } from "@research-topic-validation/contracts";
import { StatusBadge } from "./StatusBadge";
import { localizeSystemText } from "../labels";

export function MetricCard({ metric }: { metric: ObservabilityMetric }) {
  return (
    <div className="metric-card">
      <span className="small-text">{localizeSystemText(metric.label)}</span>
      <strong>{metric.value ?? "계산 안 함"}</strong>
      <StatusBadge value={metric.status} />
      {metric.note ? (
        <span className="small-text">{localizeSystemText(metric.note)}</span>
      ) : null}
    </div>
  );
}
