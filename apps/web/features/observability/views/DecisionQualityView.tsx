import type { DecisionQualityItem } from "@research-topic-validation/contracts";

const gateLabels: Record<DecisionQualityItem["gateType"], string> = {
  EXISTENCE: "Existence",
  VALUE: "Value",
  FEASIBILITY: "Feasibility",
};
const decisionLabels: Record<string, string> = {
  PROCEED: "PROCEED",
  HOLD: "HOLD",
  REFRAME: "MODIFY",
  DIFFERENTIATE: "MODIFY",
  REJECT: "REJECT",
};

export function DecisionQualityView({
  items,
}: {
  items: DecisionQualityItem[];
}) {
  return (
    <div className="observability-stack">
      {items.map((item) => (
        <section
          className="observability-card"
          key={`${item.gateType}-${item.aiAssessment}`}
        >
          <h3>{gateLabels[item.gateType]}</h3>
          <p>{item.aiAssessment}</p>
          <div className="meta">
            <span>근거 Evidence {item.evidenceIds.length}건</span>
            <span>
              Researcher Decision:{" "}
              {item.researcherDecision
                ? (decisionLabels[item.researcherDecision] ??
                  item.researcherDecision)
                : "미기록"}
            </span>
            <span>
              Override:{" "}
              {item.researcherOverride == null
                ? "미검증"
                : item.researcherOverride
                  ? "있음"
                  : "없음"}
            </span>
          </div>
        </section>
      ))}
      {!items.length ? (
        <div className="empty">Gate Assessment 데이터가 없습니다.</div>
      ) : null}
    </div>
  );
}
