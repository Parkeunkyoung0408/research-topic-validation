import { useState } from "react";
import type { ResearcherAnnotationInput } from "@research-topic-validation/contracts";

type AnnotationControlsProps = {
  gapEvidenceId: string;
  isPending: boolean;
  onAnnotate: (gapEvidenceId: string, input: ResearcherAnnotationInput) => void;
};

export function AnnotationControls({
  gapEvidenceId,
  isPending,
  onAnnotate,
}: AnnotationControlsProps) {
  const [relevanceLabel, setRelevanceLabel] =
    useState<ResearcherAnnotationInput["relevanceLabel"]>("RELEVANT");
  const [relationLabel, setRelationLabel] =
    useState<ResearcherAnnotationInput["relationLabel"]>("SUPPORTING");

  function handleSave() {
    onAnnotate(gapEvidenceId, { relevanceLabel, relationLabel });
  }

  return (
    <div className="annotation-row">
      <select
        aria-label="관련성"
        disabled={isPending}
        value={relevanceLabel}
        onChange={(event) =>
          setRelevanceLabel(
            event.target.value as ResearcherAnnotationInput["relevanceLabel"],
          )
        }
      >
        <option value="RELEVANT">관련 있음</option>
        <option value="NOT_RELEVANT">관련 없음</option>
      </select>
      <select
        aria-label="근거 관계"
        disabled={isPending}
        value={relationLabel}
        onChange={(event) =>
          setRelationLabel(
            event.target.value as ResearcherAnnotationInput["relationLabel"],
          )
        }
      >
        <option value="COUNTER_EVIDENCE">연구 공백에 대한 반대 근거</option>
        <option value="SUPPORTING">연구 필요성을 뒷받침</option>
        <option value="OTHER">기타</option>
      </select>
      <button
        className="button secondary-button"
        type="button"
        disabled={isPending}
        onClick={handleSave}
      >
        평가 저장
      </button>
    </div>
  );
}
