import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ValidationWorkspace } from "./validation-workspace";
import * as api from "../../lib/api";

vi.mock("../../lib/api");

beforeEach(() => {
  vi.resetAllMocks();
  window.scrollTo = vi.fn();
  vi.mocked(api.createProject).mockResolvedValue({
    id: "project",
    title: "topic",
    createdAt: "2026-09-08",
  });
  vi.mocked(api.createGap).mockImplementation(async (projectId, input) => ({
    gap: {
      id: "gap",
      projectId,
      gapText: input.gapText,
      status: "DRAFT",
      createdAt: "2026-09-08",
    },
    conditions: [],
  }));
  vi.mocked(api.runSearch).mockResolvedValue({
    id: "search",
    gapId: "gap",
    sourceScope: {},
    querySnapshot: {},
    resultCount: 0,
    createdAt: "2026-09-08",
    results: [],
  });
  vi.mocked(api.getGapEvidence).mockResolvedValue({ gapId: "gap", items: [] });
  vi.mocked(api.getGapReview).mockResolvedValue({ gapId: "gap", gates: [] });
  vi.mocked(api.createResearcherDecision).mockResolvedValue({
    id: "decision",
    gapId: "gap",
    action: "HOLD",
    createdAt: "2026-09-08",
  });
});
afterEach(cleanup);

async function searchTopic() {
  const user = userEvent.setup();
  render(<ValidationWorkspace />);
  await user.type(screen.getByRole("textbox"), "AI and design");
  await user.click(screen.getByRole("button", { name: "선행연구 검토 시작" }));
  await screen.findByRole("heading", { name: "AI and design" });
  return user;
}

describe("research review workflow", () => {
  it("loads rewrite suggestions only when requested and allows editing", async () => {
    const user = await searchTopic();
    vi.mocked(api.createRewriteOptions).mockResolvedValue({
      gapId: "gap",
      options: [
        {
          id: "option",
          gapId: "gap",
          action: "DIFFERENTIATE",
          title: "차별화 조건 명시",
          rewrittenGapText: "AI and design education",
          rationale: "",
          createdAt: "2026-09-08",
        },
      ],
    });
    await user.click(screen.getByRole("button", { name: "주제 수정하기" }));
    expect(api.createRewriteOptions).not.toHaveBeenCalled();
    await user.click(
      screen.getByRole("button", { name: "수정 방향 제안 보기" }),
    );
    await user.selectOptions(await screen.findByRole("combobox"), "option");
    expect(
      (screen.getByLabelText("수정할 연구 주제") as HTMLTextAreaElement).value,
    ).toBe("AI and design education");
    await user.type(screen.getByLabelText("수정할 연구 주제"), " in Korea");
    expect(
      (screen.getByLabelText("수정할 연구 주제") as HTMLTextAreaElement).value,
    ).toBe("AI and design education in Korea");
  });
  it("starts with one topic field and turns preparation inputs into a checklist", async () => {
    const user = await searchTopic();
    expect(api.assessGap).not.toHaveBeenCalled();
    expect(screen.queryByText("사용할 데이터와 접근 권한")).toBeNull();
    await user.click(
      screen.getByRole("button", { name: "연구 준비 점검하기" }),
    );
    expect(screen.getByLabelText("사용할 데이터와 접근 권한")).toBeTruthy();
    vi.mocked(api.assessGap).mockResolvedValue({
      gapId: "gap",
      gates: [
        {
          gateType: "VALUE",
          status: "PREPARATION_REVIEWED",
          grade: null,
          rationale: "",
          evidenceCount: 1,
        },
        {
          gateType: "FEASIBILITY",
          status: "PREPARATION_REVIEWED",
          grade: null,
          rationale: "",
          evidenceCount: 0,
        },
      ],
    });
    await user.type(
      screen.getByLabelText("사용할 데이터와 접근 권한"),
      "Interview records",
    );
    await user.click(screen.getByRole("button", { name: "준비 항목 정리" }));
    await screen.findByText("연구 준비 점검");
    expect(screen.getByText("추가 확인 필요")).toBeTruthy();
    expect(
      screen.getByText(
        "동의 범위, 개인정보 처리, 기관 심의 필요 여부를 확인하세요.",
      ),
    ).toBeTruthy();
    expect(api.assessGap).toHaveBeenCalledWith("gap", {
      availableData: "Interview records",
      searchRunId: "search",
    });
  });

  it("keeps revised searches in the existing project", async () => {
    const user = await searchTopic();
    await user.click(screen.getByRole("button", { name: "주제 수정하기" }));
    await user.clear(screen.getByLabelText("수정할 연구 주제"));
    await user.type(
      screen.getByLabelText("수정할 연구 주제"),
      "AI and design education",
    );
    await user.click(
      screen.getByRole("button", { name: "수정한 주제로 다시 검색" }),
    );
    await screen.findByRole("heading", { name: "AI and design education" });
    expect(api.createProject).toHaveBeenCalledTimes(1);
    expect(api.createGap).toHaveBeenLastCalledWith("project", {
      gapText: "AI and design education",
    });
  });

  it("records a hold only after confirmation", async () => {
    const user = await searchTopic();
    await user.click(screen.getByRole("button", { name: "보류하기" }));
    expect(api.createResearcherDecision).not.toHaveBeenCalled();
    await user.type(
      screen.getByLabelText("보류 이유 (선택)"),
      "Need participants",
    );
    await user.click(screen.getByRole("button", { name: "보류 결정 저장" }));
    await waitFor(() =>
      expect(api.createResearcherDecision).toHaveBeenCalledWith("gap", {
        action: "HOLD",
        rationale: "Need participants",
        reverify: false,
      }),
    );
  });

  it("shows search failure separately from empty results and permits retry", async () => {
    vi.mocked(api.runSearch).mockResolvedValueOnce({
      id: "failed",
      gapId: "gap",
      sourceScope: { adapterError: "timeout" },
      querySnapshot: {},
      resultCount: 0,
      createdAt: "2026-09-08",
      results: [],
    });
    const user = userEvent.setup();
    render(<ValidationWorkspace />);
    expect(screen.getAllByRole("textbox")).toHaveLength(1);
    await user.type(screen.getByRole("textbox"), "AI and design");
    await user.click(
      screen.getByRole("button", { name: "선행연구 검토 시작" }),
    );
    expect((await screen.findByRole("alert")).textContent).toContain(
      "연결하지 못했습니다",
    );
    expect(api.getGapReview).not.toHaveBeenCalled();
    await user.click(
      screen.getByRole("button", { name: "선행연구 검토 시작" }),
    );
    await screen.findByRole("heading", { name: "AI and design" });
  });
});
