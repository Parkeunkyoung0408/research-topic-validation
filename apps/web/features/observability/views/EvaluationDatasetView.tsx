import { useMemo } from "react";
import type {
  ObservabilityDashboard,
  ResearcherAnnotationInput,
} from "@research-topic-validation/contracts";
import { AnnotationControls } from "../components/AnnotationControls";
import { StatusBadge } from "../components/StatusBadge";
import { localizeSystemText } from "../labels";

type EvaluationDatasetViewProps = {
  dashboard: ObservabilityDashboard;
  isPending: boolean;
  onAnnotate: (gapEvidenceId: string, input: ResearcherAnnotationInput) => void;
};

export function EvaluationDatasetView({
  dashboard,
  isPending,
  onAnnotate,
}: EvaluationDatasetViewProps) {
  const annotatedIds = useMemo(
    () =>
      new Set(
        dashboard.evaluationDataset.annotations.map(
          (annotation) => annotation.gapEvidenceId,
        ),
      ),
    [dashboard.evaluationDataset.annotations],
  );
  return (
    <div className="observability-stack">
      <section className="observability-card">
        <h3>정답 평가 자료 준비 상태</h3>
        <p className="small-text">
          {localizeSystemText(
            dashboard.evaluationDataset.note ??
              "정답 평가 자료는 아직 구축되지 않았습니다.",
          )}
        </p>
        <p className="small-text">
          저장된 평가 기록 {dashboard.evaluationDataset.annotations.length}건
        </p>
      </section>
      {dashboard.evidenceQuality.map((item) => (
        <section className="observability-card" key={item.gapEvidenceId}>
          <h3>{item.paper.title}</h3>
          <p className="evidence-summary">{item.originalEvidencePassage}</p>
          <StatusBadge
            value={
              annotatedIds.has(item.gapEvidenceId)
                ? "annotated"
                : "needs_annotation"
            }
          />
          <AnnotationControls
            gapEvidenceId={item.gapEvidenceId}
            isPending={isPending}
            onAnnotate={onAnnotate}
          />
        </section>
      ))}
    </div>
  );
}
