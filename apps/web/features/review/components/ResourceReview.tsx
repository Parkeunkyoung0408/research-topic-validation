import type { GateAssessmentInput } from "@research-topic-validation/contracts";
import type { ValidationWorkspaceController } from "../hooks/useValidationWorkspace";

type PreparationField = {
  key: keyof GateAssessmentInput;
  label: string;
  placeholder: string;
  followUp: string;
};
type PreparationRecord = PreparationField & { value: string };

const preparationFields = [
  {
    key: "decisionLink",
    label: "이 연구의 결과는 어떤 결정에 도움이 되나요?",
    placeholder:
      "예: 제품팀이 AI 보조 기능을 어느 단계에 도입할지 판단하는 데 사용합니다.",
    followUp: "결정을 내릴 사람과 활용 시점을 구체화하세요.",
  },
  {
    key: "availableData",
    label: "사용할 데이터와 접근 권한",
    placeholder: "예: 2025년 사용자 인터뷰 12건, 팀 보관 폴더 접근 승인 완료",
    followUp: "데이터 위치, 접근 권한, 누락 여부를 확인하세요.",
  },
  {
    key: "notes",
    label: "데이터 사용 동의와 윤리 검토",
    placeholder:
      "예: 참여자 동의서에 2차 분석이 포함됨, 기관 심의 필요 여부 확인 중",
    followUp: "동의 범위, 개인정보 처리, 기관 심의 필요 여부를 확인하세요.",
  },
  {
    key: "participants",
    label: "참여자와 모집 계획",
    placeholder: "예: UX 디자이너 8명, 사내 커뮤니티 공고와 리크루팅 패널 사용",
    followUp: "대상, 예상 인원, 모집 경로와 예상 기간을 정하세요.",
  },
  {
    key: "timeBudget",
    label: "일정",
    placeholder: "예: 모집 2주, 인터뷰 4주, 분석 4주, 검토 2주",
    followUp: "모집, 수집, 분석, 검토 기간을 나누어 계획하세요.",
  },
  {
    key: "tools",
    label: "분석 방법과 지원",
    placeholder: "예: 주제 분석, 두 명의 코더, 분석 자문 1회",
    followUp: "분석 방법과 필요한 기술·자문 지원을 정하세요.",
  },
  {
    key: "collaboration",
    label: "필요한 협력과 승인",
    placeholder: "예: 디자인 리서치팀 협조, 조직 데이터 담당자 승인 필요",
    followUp: "협조할 사람, 기관, 승인 절차를 확인하세요.",
  },
] satisfies PreparationField[];

type ResourceReviewProps = {
  workspace: Pick<
    ValidationWorkspaceController,
    | "result"
    | "assessmentInput"
    | "isPending"
    | "handleAssessment"
    | "handleAssessmentInputChange"
  >;
};

export function ResourceReview({ workspace }: ResourceReviewProps) {
  const hasReview = workspace.result?.review.gates.some(
    (gate) =>
      gate.gateType === "FEASIBILITY" && gate.status === "PREPARATION_REVIEWED",
  );
  const records = preparationFields.map((field) => ({
    ...field,
    value: workspace.assessmentInput[field.key]?.trim() ?? "",
  }));
  const recordedFields = records.filter((field) => field.value);
  const missingFields = records.filter((field) => !field.value);

  return (
    <div className="action-form">
      <form
        className="action-form"
        onSubmit={(event) => {
          event.preventDefault();
          workspace.handleAssessment();
        }}
      >
        <p className="small-text">
          이 점검은 연구 가능 여부를 판정하지 않습니다. 현재 확보한 정보와 더
          확인할 조건을 정리합니다.
        </p>
        {preparationFields.map((field) => (
          <label className="field" key={field.key}>
            {field.label}
            <textarea
              className="textarea compact"
              placeholder={field.placeholder}
              disabled={workspace.isPending}
              value={workspace.assessmentInput[field.key] ?? ""}
              onChange={(event) =>
                workspace.handleAssessmentInputChange(
                  field.key,
                  event.target.value,
                )
              }
            />
          </label>
        ))}
        <button className="button" disabled={workspace.isPending}>
          준비 항목 정리
        </button>
      </form>
      {hasReview ? (
        <section
          className="assessment-result"
          aria-labelledby="preparation-summary"
        >
          <h3 id="preparation-summary">연구 준비 점검</h3>
          <div className="readiness-grid">
            <PreparationList
              title="기록된 사실"
              fields={recordedFields}
              emptyMessage="아직 기록된 준비 조건이 없습니다."
              showValue
            />
            <PreparationList
              title="추가 확인 필요"
              fields={missingFields}
              emptyMessage="입력한 항목 기준으로 추가 확인 항목이 없습니다."
            />
          </div>
        </section>
      ) : null}
    </div>
  );
}

type PreparationListProps = {
  title: string;
  fields: PreparationRecord[];
  emptyMessage: string;
  showValue?: boolean;
};

function PreparationList({
  title,
  fields,
  emptyMessage,
  showValue = false,
}: PreparationListProps) {
  return (
    <section className="preparation-list">
      <h4>{title}</h4>
      {fields.length ? (
        <ul>
          {fields.map((field) => (
            <li key={field.key}>
              <strong>{field.label}</strong>
              <span>{showValue ? field.value : field.followUp}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="small-text">{emptyMessage}</p>
      )}
    </section>
  );
}
