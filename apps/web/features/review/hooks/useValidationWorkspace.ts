import { useState, useTransition } from "react";
import type {
  GapEvidence,
  GapHypothesis,
  GapReview,
  GateAssessmentInput,
  RewriteOption,
  SearchRun,
} from "@research-topic-validation/contracts";
import {
  assessGap,
  createGap,
  createProject,
  createResearcherDecision,
  createRewriteOptions,
  getGapEvidence,
  getGapReview,
  runSearch,
} from "../../../lib/api";

export type ValidationResult = {
  gap: GapHypothesis;
  searchRun: SearchRun;
  evidence: GapEvidence[];
  review: GapReview;
};
export type NextAction = "rewrite" | "resources" | "hold" | null;

export function useValidationWorkspace() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [status, setStatus] = useState({ error: false, message: "" });
  const [activeAction, setActiveAction] = useState<NextAction>(null);
  const [assessmentInput, setAssessmentInput] = useState<GateAssessmentInput>(
    {},
  );
  const [rewriteText, setRewriteText] = useState("");
  const [rewriteOptions, setRewriteOptions] = useState<RewriteOption[]>([]);
  const [rationale, setRationale] = useState("");
  const [isPending, startTransition] = useTransition();

  function performAction(message: string, action: () => Promise<void>) {
    startTransition(async () => {
      setStatus({ error: false, message });
      try {
        await action();
      } catch {
        setStatus({
          error: true,
          message:
            "요청을 완료하지 못했습니다. 서버 연결을 확인하고 다시 시도해 주세요.",
        });
      }
    });
  }

  async function searchTopic(nextTopic: string) {
    const projectId =
      result?.gap.projectId ??
      (
        await createProject({
          title: nextTopic.slice(0, 80),
          description: nextTopic,
        })
      ).id;
    const { gap } = await createGap(projectId, { gapText: nextTopic });
    const searchRun = await runSearch(gap.id, { query: nextTopic, limit: 10 });
    if (searchRun.sourceScope.adapterError) {
      setStatus({
        error: true,
        message:
          "논문 검색 서비스에 연결하지 못했습니다. 잠시 후 다시 검색해 주세요.",
      });
      return;
    }
    const [evidence, review] = await Promise.all([
      getGapEvidence(gap.id),
      getGapReview(gap.id),
    ]);
    setResult({ gap, searchRun, evidence: evidence.items, review });
    setTopic(nextTopic);
    setRewriteText(nextTopic);
    setRewriteOptions([]);
    setActiveAction(null);
    setRationale("");
    setStatus({ error: false, message: "선행연구 검토를 완료했습니다." });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSearch() {
    if (!topic.trim()) {
      setStatus({
        error: true,
        message: "연구하고 싶은 주제를 입력해 주세요.",
      });
      return;
    }
    performAction("관련 논문을 찾고 있습니다…", () =>
      searchTopic(topic.trim()),
    );
  }
  function handleAssessment() {
    if (!result) return;
    if (
      !Object.values(assessmentInput).some(
        (value) => typeof value === "string" && value.trim(),
      )
    ) {
      setStatus({
        error: true,
        message: "연구 목적이나 실행 여건을 하나 이상 입력해 주세요.",
      });
      return;
    }
    performAction("연구 준비 항목을 정리하고 있습니다…", async () => {
      const review = await assessGap(result.gap.id, {
        ...assessmentInput,
        searchRunId: result.searchRun.id,
      });
      setResult((current) => (current ? { ...current, review } : current));
      setStatus({
        error: false,
        message: "입력한 내용을 연구 준비 점검에 반영했습니다.",
      });
    });
  }
  function handleRewrite() {
    if (!rewriteText.trim()) {
      setStatus({ error: true, message: "수정할 연구 주제를 입력해 주세요." });
      return;
    }
    performAction("수정한 주제의 관련 논문을 찾고 있습니다…", () =>
      searchTopic(rewriteText.trim()),
    );
  }
  function handleRewriteSuggestions() {
    if (!result) return;
    performAction("수정 방향을 준비하고 있습니다…", async () => {
      const response = await createRewriteOptions(result.gap.id);
      setRewriteOptions(
        response.options.filter(
          (option) =>
            option.action === "REFRAME" || option.action === "DIFFERENTIATE",
        ),
      );
      setStatus({ error: false, message: "수정 방향을 준비했습니다." });
    });
  }
  function handleDecision(action: "HOLD" | "PROCEED") {
    if (!result) return;
    performAction("결정을 저장하고 있습니다…", async () => {
      await createResearcherDecision(result.gap.id, {
        action,
        rationale,
        reverify: false,
      });
      setStatus({
        error: false,
        message:
          action === "HOLD"
            ? "이 주제를 보류하기로 기록했습니다."
            : "현재 주제로 진행하기로 기록했습니다.",
      });
      setActiveAction(null);
    });
  }
  function handleNewTopic() {
    setTopic("");
    setResult(null);
    setActiveAction(null);
    setAssessmentInput({});
    setRewriteText("");
    setRewriteOptions([]);
    setRationale("");
    setStatus({ error: false, message: "" });
  }
  function handleAssessmentInputChange(
    key: keyof GateAssessmentInput,
    value: string,
  ) {
    setAssessmentInput((current) => ({ ...current, [key]: value }));
  }
  return {
    topic,
    result,
    status,
    activeAction,
    assessmentInput,
    rewriteText,
    rewriteOptions,
    rationale,
    isPending,
    handleTopicChange: setTopic,
    handleRewriteTextChange: setRewriteText,
    handleRationaleChange: setRationale,
    handleSelectAction: setActiveAction,
    handleSearch,
    handleAssessment,
    handleRewrite,
    handleRewriteSuggestions,
    handleDecision,
    handleNewTopic,
    handleAssessmentInputChange,
  };
}
export type ValidationWorkspaceController = ReturnType<
  typeof useValidationWorkspace
>;
