import type { ValidationResult } from "../hooks/useValidationWorkspace";
import { EvidenceList } from "./EvidenceList";

export function ReviewResults({ result }: { result: ValidationResult }) {
  const overlappingCount = result.evidence.filter(
    (item) => item.overlapGrade === "DIRECT" || item.overlapGrade === "P1",
  ).length;
  return (
    <>
      <section className="review-section" aria-labelledby="review-summary">
        <p className="section-kicker">01 · 검토 요약</p>
        <h1 id="review-summary">{result.gap.gapText}</h1>
        <p className="review-conclusion">
          {!result.evidence.length
            ? "관련 논문을 찾지 못했습니다. 검색어를 바꿔 다시 확인해 보세요."
            : overlappingCount
              ? `기존 연구와 겹칠 수 있는 논문이 ${overlappingCount}건 있습니다.`
              : "검색된 논문에서 직접적으로 겹치는 후보는 발견되지 않았습니다."}
        </p>
        <p className="small-text">
          OpenAlex · 검색 결과 {result.searchRun.resultCount}건 ·{" "}
          {new Date(result.searchRun.createdAt).toLocaleDateString("ko-KR")}
        </p>
        <p className="small-text">
          제목과 초록을 기준으로 한 예비 검토입니다. 검색 결과만으로 주제의
          신규성을 확정할 수 없습니다.
        </p>
      </section>
      <EvidenceList evidence={result.evidence} />
    </>
  );
}
