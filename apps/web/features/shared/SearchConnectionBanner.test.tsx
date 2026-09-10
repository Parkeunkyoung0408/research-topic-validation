import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchConnectionBanner } from "./SearchConnectionBanner";
import { getSearchConnection } from "../../lib/api";

vi.mock("../../lib/api", () => ({ getSearchConnection: vi.fn() }));
afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

it("shows a correlated failure and recovers after an explicit check", async () => {
  vi.mocked(getSearchConnection)
    .mockResolvedValueOnce({
      status: "unavailable",
      message: "네트워크 접근이 차단되었습니다.",
      errorId: "error-123",
    })
    .mockResolvedValueOnce({
      status: "available",
      message: "논문 검색 연결이 정상입니다.",
      checkedAt: new Date().toISOString(),
    });
  render(<SearchConnectionBanner />);
  expect(await screen.findByText(/error-123/)).toBeTruthy();
  await userEvent.click(screen.getByRole("button", { name: "다시 연결 확인" }));
  expect(await screen.findByText("논문 검색 준비 완료")).toBeTruthy();
  expect(getSearchConnection).toHaveBeenLastCalledWith(true);
  expect(screen.queryByText(/error-123/)).toBeNull();
});

it("distinguishes backend disconnection from an upstream failure", async () => {
  vi.mocked(getSearchConnection).mockRejectedValue(
    new Error("Failed to fetch"),
  );
  render(<SearchConnectionBanner />);
  expect(await screen.findByText(/서버 연결을 확인할 수 없어요/)).toBeTruthy();
});
