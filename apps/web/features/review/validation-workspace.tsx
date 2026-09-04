"use client";

import { useState, useTransition } from "react";
import type {
  GapCondition,
  GapEvidence,
  GapHypothesis,
  GapReview,
  GateAssessmentInput,
  Project,
  ResearcherDecision,
  RewriteOption,
  SearchRun
} from "@research-topic-validation/contracts";
import {
  assessGap,
  createGap,
  createProject,
  createResearcherDecision,
  createRewriteOptions,
  getGapEvidence,
  runSearch
} from "../../lib/api";

type Status = { kind: "idle" | "ok" | "error"; message: string };

const initialAssessmentInput: GateAssessmentInput = {
  decisionLink: "",
  availableData: "",
  participants: "",
  tools: "",
  timeBudget: "",
  collaboration: "",
  notes: ""
};

export function ValidationWorkspace() {
  const [topic, setTopic] = useState("");
  const [assessmentInput, setAssessmentInput] = useState<GateAssessmentInput>(initialAssessmentInput);
  const [project, setProject] = useState<Project | null>(null);
  const [gap, setGap] = useState<GapHypothesis | null>(null);
  const [conditions, setConditions] = useState<GapCondition[]>([]);
  const [searchRun, setSearchRun] = useState<SearchRun | null>(null);
  const [evidence, setEvidence] = useState<GapEvidence[]>([]);
  const [review, setReview] = useState<GapReview | null>(null);
  const [rewriteOptions, setRewriteOptions] = useState<RewriteOption[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState("");
  const [decisionRationale, setDecisionRationale] = useState("");
  const [decision, setDecision] = useState<ResearcherDecision | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle", message: "API 서버 연결 대기 중입니다." });
  const [isPending, startTransition] = useTransition();

  function updateAssessmentInput(key: keyof GateAssessmentInput, value: string) {
    setAssessmentInput((current) => ({ ...current, [key]: value }));
  }

  async function runValidationForTopic(normalizedTopic: string, successMessage: string) {
    const nextProject = await createProject({
      title: normalizedTopic.slice(0, 80),
      description: normalizedTopic
    });
    const nextGap = await createGap(nextProject.id, { gapText: normalizedTopic });
    const nextSearchRun = await runSearch(nextGap.gap.id, { query: normalizedTopic, limit: 10 });
    const nextEvidence = await getGapEvidence(nextGap.gap.id);
    const nextReview = await assessGap(nextGap.gap.id, {
      ...assessmentInput,
      searchRunId: nextSearchRun.id
    });
    const nextOptions = await createRewriteOptions(nextGap.gap.id);

    setTopic(normalizedTopic);
    setProject(nextProject);
    setGap(nextGap.gap);
    setConditions(nextGap.conditions);
    setSearchRun(nextSearchRun);
    setEvidence(nextEvidence.items);
    setReview(nextReview);
    setRewriteOptions(nextOptions.options);
    setSelectedOptionId(nextOptions.options[0]?.id ?? "");
    setDecision(null);
    setStatus({ kind: "ok", message: successMessage });
  }

  function startValidation() {
    const normalizedTopic = topic.trim();
    if (!normalizedTopic) {
      setStatus({ kind: "error", message: "먼저 연구 주제를 입력하세요." });
      return;
    }

    startTransition(async () => {
      try {
        setStatus({ kind: "idle", message: "검색, Evidence 생성, 3-Gate 판정, 수정 옵션 생성을 실행하는 중입니다." });
        await runValidationForTopic(normalizedTopic, "검색 기록, Evidence, 3-Gate 판정, 수정 옵션을 저장했습니다.");
      } catch (error) {
        setStatus({
          kind: "error",
          message: error instanceof Error ? error.message : "검증 실행에 실패했습니다."
        });
      }
    });
  }

  function submitDecision() {
    if (!gap) {
      setStatus({ kind: "error", message: "먼저 검증을 실행하세요." });
      return;
    }
    const option = rewriteOptions.find((item) => item.id === selectedOptionId);
    if (!option) {
      setStatus({ kind: "error", message: "선택할 수정 옵션이 없습니다." });
      return;
    }

    startTransition(async () => {
      try {
        const nextDecision = await createResearcherDecision(gap.id, {
          action: option.action,
          rewriteOptionId: option.id,
          rationale: decisionRationale,
          reverify: true
        });
        setDecision(nextDecision);
        setStatus({
          kind: "ok",
          message: nextDecision.newGapId
            ? "연구자 선택을 저장했고 재검증용 새 Gap 버전을 만들었습니다."
            : "연구자 선택을 저장했습니다."
        });
      } catch (error) {
        setStatus({
          kind: "error",
          message: error instanceof Error ? error.message : "연구자 선택 저장에 실패했습니다."
        });
      }
    });
  }

  function revalidateSelectedRewrite() {
    if (!gap) {
      setStatus({ kind: "error", message: "먼저 검증을 실행하세요." });
      return;
    }
    const option = rewriteOptions.find((item) => item.id === selectedOptionId);
    if (!option) {
      setStatus({ kind: "error", message: "재검증할 수정 옵션이 없습니다." });
      return;
    }

    startTransition(async () => {
      try {
        setStatus({ kind: "idle", message: "선택한 수정안을 저장하고 재검증을 실행하는 중입니다." });
        await createResearcherDecision(gap.id, {
          action: option.action,
          rewriteOptionId: option.id,
          rationale: decisionRationale,
          reverify: true
        });
        await runValidationForTopic(option.rewrittenGapText, "선택한 수정안으로 재검증을 완료했습니다.");
      } catch (error) {
        setStatus({
          kind: "error",
          message: error instanceof Error ? error.message : "재검증 실행에 실패했습니다."
        });
      }
    });
  }

  function resetWorkspace() {
    setTopic("");
    setAssessmentInput(initialAssessmentInput);
    setProject(null);
    setGap(null);
    setConditions([]);
    setSearchRun(null);
    setEvidence([]);
    setReview(null);
    setRewriteOptions([]);
    setSelectedOptionId("");
    setDecisionRationale("");
    setDecision(null);
    setStatus({ kind: "idle", message: "API 서버 연결 대기 중입니다." });
  }

  return (
    <main className="workspace">
      <header className="topbar">
        <div className="brand">
          <span className="brand-title">연구 주제 검증</span>
          <span className="brand-subtitle">신규성, 가치, 실행 가능성, 재검증 루프</span>
        </div>
        <div className="button-row">
          <a className="nav-link" href="/observability">
            Observability
          </a>
          <span className="small-text">MVP 4차 스프린트</span>
        </div>
      </header>

      <div className="layout">
        <section className="panel" aria-labelledby="topic-title">
          <div className="panel-header">
            <h1 id="topic-title" className="panel-title">검증 입력</h1>
          </div>
          <div className="panel-body">
            <label className="field">
              <span className="label">주제 또는 Gap 가설</span>
              <textarea
                className="textarea"
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                placeholder="예: generative AI UX designer idea diversity actual work"
              />
            </label>

            <div className="form-section">
              <h2 className="section-title">가치 검토</h2>
              <label className="field">
                <span className="label">Decision Link</span>
                <textarea
                  className="textarea compact"
                  value={assessmentInput.decisionLink ?? ""}
                  onChange={(event) => updateAssessmentInput("decisionLink", event.target.value)}
                  placeholder="이 연구가 완료되면 어떤 판단, 설계, 정책, 이론 설명이 달라지는지 적어주세요."
                />
              </label>
            </div>

            <div className="form-section">
              <h2 className="section-title">실행 가능성 검토</h2>
              <label className="field">
                <span className="label">보유 데이터</span>
                <input
                  className="input"
                  value={assessmentInput.availableData ?? ""}
                  onChange={(event) => updateAssessmentInput("availableData", event.target.value)}
                  placeholder="예: 인터뷰 기록, 설문 응답, 사용 로그"
                />
              </label>
              <label className="field">
                <span className="label">참여자 접근성</span>
                <input
                  className="input"
                  value={assessmentInput.participants ?? ""}
                  onChange={(event) => updateAssessmentInput("participants", event.target.value)}
                  placeholder="예: UX 디자이너 8명 섭외 가능"
                />
              </label>
              <label className="field">
                <span className="label">도구와 분석 역량</span>
                <input
                  className="input"
                  value={assessmentInput.tools ?? ""}
                  onChange={(event) => updateAssessmentInput("tools", event.target.value)}
                  placeholder="예: Python, 인터뷰 코딩, 통계 분석"
                />
              </label>
              <label className="field">
                <span className="label">시간과 범위</span>
                <input
                  className="input"
                  value={assessmentInput.timeBudget ?? ""}
                  onChange={(event) => updateAssessmentInput("timeBudget", event.target.value)}
                  placeholder="예: 12주 파일럿 가능"
                />
              </label>
              <label className="field">
                <span className="label">협업 가능성</span>
                <input
                  className="input"
                  value={assessmentInput.collaboration ?? ""}
                  onChange={(event) => updateAssessmentInput("collaboration", event.target.value)}
                  placeholder="예: 지도교수, 실무 조직, 공동연구자"
                />
              </label>
            </div>

            <div className="button-row">
              <button className="button" type="button" disabled={isPending} onClick={startValidation}>
                {isPending ? "실행 중" : "4단계 검증 실행"}
              </button>
              <button className="button secondary-button" type="button" disabled={isPending} onClick={resetWorkspace}>
                초기화
              </button>
            </div>
            {status.message ? <div className={`status ${status.kind === "error" ? "error" : ""}`}>{status.message}</div> : null}
          </div>
        </section>

        <section className="panel" aria-labelledby="review-title">
          <div className="panel-header">
            <h2 id="review-title" className="panel-title">근거 검토</h2>
          </div>
          <div className="panel-body">
            {project && gap ? (
              <>
                <GateGrid review={review} />

                <div>
                  <p className="small-text">프로젝트: {project.title}</p>
                  <p className="small-text">Gap: {gap.gapText}</p>
                  <p className="small-text">
                    조건: {conditions.length ? conditions.map((item) => item.label).join(", ") : "아직 감지된 조건이 없습니다."}
                  </p>
                  <p className="small-text">검색 결과: {searchRun?.resultCount ?? 0}건</p>
                </div>

                <RewriteOptionsPanel
                  options={rewriteOptions}
                  selectedOptionId={selectedOptionId}
                  decisionRationale={decisionRationale}
                  decision={decision}
                  isPending={isPending}
                  onSelect={setSelectedOptionId}
                  onRationaleChange={setDecisionRationale}
                  onSubmit={submitDecision}
                  onRevalidate={revalidateSelectedRewrite}
                />

                <EvidenceList evidence={evidence} hasSearchRun={Boolean(searchRun)} />
              </>
            ) : (
              <div className="empty">연구 주제와 검토 정보를 입력한 뒤 4단계 검증을 실행하세요.</div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function GateGrid({ review }: { review: GapReview | null }) {
  const gates = review?.gates ?? [
    {
      gateType: "EXISTENCE" as const,
      status: "NO_EVIDENCE",
      rationale: "아직 분류된 Evidence가 없습니다.",
      evidenceCount: 0
    },
    {
      gateType: "VALUE" as const,
      status: "PENDING_DECISION_LINK",
      rationale: "Decision Link와 연구 필요성 근거 연결이 필요합니다.",
      evidenceCount: 0
    },
    {
      gateType: "FEASIBILITY" as const,
      status: "PENDING_PROFILE",
      rationale: "Researcher Profile과 Enabling/Data 근거 연결이 필요합니다.",
      evidenceCount: 0
    }
  ];

  return (
    <div className="gate-grid">
      {gates.map((gate) => (
        <div className="gate" key={gate.gateType}>
          <strong>{gateLabel(gate.gateType)}</strong>
          <span className="gate-status">{gate.grade ? `${statusLabel(gate.status)} · ${gate.grade}` : statusLabel(gate.status)}</span>
          <span className="small-text">{gate.rationale}</span>
          <span className="small-text">연결 근거 {gate.evidenceCount}건</span>
        </div>
      ))}
    </div>
  );
}

function RewriteOptionsPanel({
  options,
  selectedOptionId,
  decisionRationale,
  decision,
  isPending,
  onSelect,
  onRationaleChange,
  onSubmit,
  onRevalidate
}: {
  options: RewriteOption[];
  selectedOptionId: string;
  decisionRationale: string;
  decision: ResearcherDecision | null;
  isPending: boolean;
  onSelect: (value: string) => void;
  onRationaleChange: (value: string) => void;
  onSubmit: () => void;
  onRevalidate: () => void;
}) {
  if (!options.length) {
    return null;
  }

  return (
    <div className="decision-panel">
      <h3 className="section-title">수정 옵션과 연구자 결정</h3>
      <div className="option-grid">
        {options.map((option) => (
          <label className={`option-card ${selectedOptionId === option.id ? "selected" : ""}`} key={option.id}>
            <input
              type="radio"
              name="rewrite-option"
              value={option.id}
              checked={selectedOptionId === option.id}
              onChange={(event) => onSelect(event.target.value)}
            />
            <span className="option-title">{option.title}</span>
            <span className="small-text">{decisionActionLabel(option.action)}</span>
            <span className="small-text">{option.rationale}</span>
            <span className="rewrite-text">{option.rewrittenGapText}</span>
          </label>
        ))}
      </div>
      <label className="field">
        <span className="label">선택 이유</span>
        <textarea
          className="textarea compact"
          value={decisionRationale}
          onChange={(event) => onRationaleChange(event.target.value)}
          placeholder="이 선택을 하는 이유나 보류 조건을 적어주세요."
        />
      </label>
      <div className="button-row">
        <button className="button" type="button" disabled={isPending} onClick={onSubmit}>
          선택 저장
        </button>
        <button className="button secondary-button" type="button" disabled={isPending} onClick={onRevalidate}>
          선택안으로 재검증
        </button>
      </div>
      {decision ? (
        <div className="status">
          저장된 결정: {decisionActionLabel(decision.action)}
          {decision.newGapId ? ` · 새 Gap 버전 ${decision.newGapId}` : ""}
        </div>
      ) : null}
    </div>
  );
}

function EvidenceList({ evidence, hasSearchRun }: { evidence: GapEvidence[]; hasSearchRun: boolean }) {
  return (
    <div className="result-grid">
      {evidence.map((item) => (
        <article className="result-item" key={item.id}>
          <div className="result-heading">
            <h3 className="result-title">{item.paper.title}</h3>
            <span className={`badge badge-${item.overlapGrade.toLowerCase()}`}>{overlapLabel(item.overlapGrade)}</span>
          </div>
          <div className="meta">
            {item.paper.publicationYear ? <span>{item.paper.publicationYear}</span> : null}
            {item.paper.doi ? <span>{item.paper.doi}</span> : null}
            {item.paper.oaStatus ? <span>{item.paper.oaStatus}</span> : null}
            <span>강도 {Math.round(item.strength * 100)}%</span>
          </div>
          <p className="evidence-summary">{item.passages[0]?.passageText ?? "근거 구절이 없습니다."}</p>
          <div className="meta">
            <span>역할: {item.roles.map((role) => roleLabel(role.roleType)).join(", ")}</span>
          </div>
          {item.matchedConditions.length ? <div className="condition-list">일치 조건: {item.matchedConditions.join(", ")}</div> : null}
        </article>
      ))}
      {hasSearchRun && evidence.length === 0 ? <div className="empty">검색 후보가 없어 Evidence를 만들지 못했습니다.</div> : null}
    </div>
  );
}

function gateLabel(value: string) {
  const labels: Record<string, string> = {
    EXISTENCE: "존재성",
    VALUE: "가치",
    FEASIBILITY: "실행 가능성"
  };
  return labels[value] ?? value;
}

function statusLabel(value: string) {
  const labels: Record<string, string> = {
    EXISTING: "기존재",
    NARROWING_REQUIRED: "축소 필요",
    FRAGILE: "취약",
    NOVEL_WITHIN_SCOPE: "검색 범위 내 신규 가능성",
    NO_EVIDENCE: "근거 없음",
    PENDING_DECISION_LINK: "Decision Link 필요",
    PENDING_PROFILE: "연구자 프로필 필요",
    ASSESSED: "판정 완료",
    FEASIBLE: "가능",
    COLLAB_REQUIRED: "협업 필요",
    RESOURCE_REQUIRED: "자원 확보 필요",
    HOLD: "보류"
  };
  return labels[value] ?? value;
}

function overlapLabel(value: string) {
  const labels: Record<string, string> = {
    DIRECT: "Direct",
    P1: "P1",
    P2: "P2",
    ADJACENT: "인접"
  };
  return labels[value] ?? value;
}

function roleLabel(value: string) {
  const labels: Record<string, string> = {
    COUNTER: "반박/겹침",
    MOTIVATING: "필요성",
    CALLS_FOR: "향후 연구",
    ENABLING: "실행 근거",
    SELF_OVERLAP: "자기 중복",
    RELATED: "관련"
  };
  return labels[value] ?? value;
}

function decisionActionLabel(value: string) {
  const labels: Record<string, string> = {
    PROCEED: "진행",
    HOLD: "보류",
    REFRAME: "재구성",
    DIFFERENTIATE: "차별화",
    REJECT: "기각"
  };
  return labels[value] ?? value;
}
