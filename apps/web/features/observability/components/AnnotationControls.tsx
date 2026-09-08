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
        <option value="RELEVANT">Relevant</option>
        <option value="NOT_RELEVANT">Not Relevant</option>
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
        <option value="COUNTER_EVIDENCE">Counter Evidence</option>
        <option value="SUPPORTING">Supporting</option>
        <option value="OTHER">Other</option>
      </select>
      <button
        className="button secondary-button"
        type="button"
        disabled={isPending}
        onClick={handleSave}
      >
        Annotation 저장
      </button>
    </div>
  );
}
