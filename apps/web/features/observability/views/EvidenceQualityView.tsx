import type {
  EvidenceQualityItem,
  ResearcherAnnotationInput,
} from "@research-topic-validation/contracts";
import { AnnotationControls } from "../components/AnnotationControls";
import { getStatusLabel } from "../components/StatusBadge";

type EvidenceQualityViewProps = {
  items: EvidenceQualityItem[];
  isPending: boolean;
  onAnnotate: (gapEvidenceId: string, input: ResearcherAnnotationInput) => void;
};

export function EvidenceQualityView({
  items,
  isPending,
  onAnnotate,
}: EvidenceQualityViewProps) {
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
            <span>Citation: {getStatusLabel(item.citationMatch)}</span>
            <span>Grounding: {getStatusLabel(item.groundingStatus)}</span>
            <span>Unsupported: {getStatusLabel(item.unsupportedClaim)}</span>
            <span>Relation: {item.evidenceRelation}</span>
          </div>
          <AnnotationControls
            gapEvidenceId={item.gapEvidenceId}
            isPending={isPending}
            onAnnotate={onAnnotate}
          />
        </section>
      ))}
      {!items.length ? (
        <div className="empty">
          Evidence 데이터가 없습니다. 먼저 검증을 실행하세요.
        </div>
      ) : null}
    </div>
  );
}
