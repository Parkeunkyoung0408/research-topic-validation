import type { GapEvidence } from "@research-topic-validation/contracts";
const overlapLabels = {
  DIRECT: "겹침이 큼",
  P1: "일부 겹침",
  P2: "부분적으로 관련",
  ADJACENT: "인접 분야",
};

export function EvidenceList({ evidence }: { evidence: GapEvidence[] }) {
  return (
    <section className="review-section" aria-labelledby="related-papers">
      <p className="section-kicker">02 · 관련 연구</p>
      <h2 id="related-papers">내 주제와 어떤 점이 비슷할까요?</h2>
      {evidence.length ? (
        <div className="paper-list">
          {evidence.map((item) => (
            <article className="paper-row" key={item.id}>
              <div className="result-heading">
                <h3>{item.paper.title}</h3>
                <span
                  className={`badge badge-${item.overlapGrade.toLowerCase()}`}
                >
                  {overlapLabels[item.overlapGrade]}
                </span>
              </div>
              <p className="small-text">
                {item.paper.publicationYear ?? "발행 연도 미상"}
              </p>
              <p>
                {item.matchedConditions.length
                  ? `겹치는 조건: ${item.matchedConditions.join(", ")}`
                  : "검색어와 관련된 후보입니다. 구체적인 관련성은 초록에서 확인이 필요합니다."}
              </p>
              <details>
                <summary>초록과 비교 근거</summary>
                <div className="paper-detail">
                  {item.passages.length ? (
                    item.passages.map((passage) => (
                      <p key={passage.id}>{passage.passageText}</p>
                    ))
                  ) : (
                    <p>제공된 초록이 없습니다.</p>
                  )}
                  {item.mismatchedConditions.length ? (
                    <p>
                      일치가 확인되지 않은 조건:{" "}
                      {item.mismatchedConditions.join(", ")}
                    </p>
                  ) : null}
                  <p className="small-text">
                    단어 일치에 기반한 분류이며, 조건의 불일치가 실제 연구
                    차이를 뜻하지는 않습니다.
                  </p>
                  {item.paper.doi?.startsWith("https://doi.org/") ? (
                    <a href={item.paper.doi} target="_blank" rel="noreferrer">
                      논문 원문 보기
                    </a>
                  ) : null}
                </div>
              </details>
            </article>
          ))}
        </div>
      ) : (
        <p className="empty">
          검색된 논문이 없습니다. 아래에서 주제를 수정해 다시 검색할 수
          있습니다.
        </p>
      )}
    </section>
  );
}
