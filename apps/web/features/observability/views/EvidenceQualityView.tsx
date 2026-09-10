import type {
  EvidenceQualityItem,
  ResearcherAnnotationInput,
} from "@research-topic-validation/contracts";
import { AnnotationControls } from "../components/AnnotationControls";
import { getStatusLabel } from "../components/StatusBadge";
import { localizeSystemText } from "../labels";

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
              <h3>자동 분류 요약</h3>
              <p>
                {localizeSystemText(
                  item.aiEvidenceClaim ?? "자동 분류 기록 없음",
                )}
              </p>
            </div>
            <div>
              <h3>수집된 초록 또는 제목</h3>
              <p>{item.originalEvidencePassage || "수집된 문장 없음"}</p>
            </div>
          </div>
          <div className="meta">
            <span>{item.paper.title}</span>
            <span>{item.source}</span>
            <span>인용 일치 여부: {getStatusLabel(item.citationMatch)}</span>
            <span>
              주장과 원문 일치 여부: {getStatusLabel(item.groundingStatus)}
            </span>
            <span>
              근거 없는 주장 여부: {getStatusLabel(item.unsupportedClaim)}
            </span>
            <span>근거 역할: {localizeSystemText(item.evidenceRelation)}</span>
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
          논문 근거가 없습니다. 먼저 검증을 실행하세요.
        </div>
      ) : null}
    </div>
  );
}
