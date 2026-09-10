import type { DecisionQualityItem } from "@research-topic-validation/contracts";
import { localizeSystemText } from "../labels";

const gateLabels: Record<DecisionQualityItem["gateType"], string> = {
  EXISTENCE: "선행연구 중복 여부",
  VALUE: "연구 가치",
  FEASIBILITY: "실행 가능성",
};
const decisionLabels: Record<string, string> = {
  PROCEED: "진행",
  HOLD: "보류",
  REFRAME: "질문 재구성",
  DIFFERENTIATE: "차별화",
  REJECT: "중단",
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
          <p>{localizeSystemText(item.aiAssessment)}</p>
          <div className="meta">
            <span>연결된 근거 {item.evidenceIds.length}건</span>
            <span>
              연구자 결정:{" "}
              {item.researcherDecision
                ? (decisionLabels[item.researcherDecision] ??
                  item.researcherDecision)
                : "미기록"}
            </span>
            <span>
              자동 판단 변경:{" "}
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
        <div className="empty">저장된 판단 기록이 없습니다.</div>
      ) : null}
    </div>
  );
}
