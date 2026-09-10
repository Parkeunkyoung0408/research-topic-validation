"use client";

import { useEffect, useState } from "react";
import {
  getSearchConnection,
  type SearchConnectionStatus,
} from "../../lib/api";

export function SearchConnectionBanner() {
  const [state, setState] = useState<SearchConnectionStatus | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    async function read() {
      try {
        const next = await getSearchConnection();
        if (active) {
          setState(next);
          setError(false);
        }
      } catch {
        if (active) setError(true);
      }
    }
    void read();
    // Reads cached status only; polling never calls OpenAlex.
    const timer = window.setInterval(() => void read(), 15000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  async function recheck() {
    setChecking(true);
    try {
      setState(await getSearchConnection(true));
      setError(false);
    } catch {
      setError(true);
    } finally {
      setChecking(false);
    }
  }

  const pending =
    checking || (!error && (!state || state.status === "checking"));
  const checkedAt = state?.checkedAt ? new Date(state.checkedAt) : null;
  const validTime = checkedAt && Number.isFinite(checkedAt.getTime());
  const stale =
    state?.status === "available" &&
    (!validTime || Date.now() - checkedAt.getTime() > 120000);
  const tone = pending
    ? "checking"
    : error || state?.status === "unavailable"
      ? "error"
      : stale
        ? "stale"
        : "ready";
  const title = {
    checking: "논문 검색 연결 확인 중…",
    error: error
      ? "서버 연결을 확인할 수 없어요"
      : "지금은 논문 검색에 연결할 수 없어요",
    stale: "검색 연결을 다시 확인해 주세요",
    ready: "논문 검색 준비 완료",
  }[tone];
  const description = {
    checking: "연결 상태를 확인하고 있어요. 잠시만 기다려 주세요.",
    error: error
      ? "서버 응답을 받지 못했어요. 잠시 후 다시 시도해 주세요."
      : state?.message,
    stale:
      "마지막 확인 후 시간이 지났어요. 다시 확인하면 현재 연결 상태를 알 수 있어요.",
    ready:
      "논문 검색 서비스에 연결됐어요. 연구 주제를 입력해 검색을 시작하세요.",
  }[tone];

  return (
    <section
      className={`search-connection search-connection--${tone}`}
      aria-label="논문 검색 연결 상태"
    >
      <div
        className="search-connection__content"
        role="status"
        aria-atomic="true"
      >
        <span className="search-connection__icon" aria-hidden="true">
          {tone === "ready" ? "✓" : tone === "checking" ? "…" : "!"}
        </span>
        <div className="search-connection__text">
          <strong className="search-connection__title">{title}</strong>
          <p className="search-connection__description">{description}</p>
          {!error && validTime && !pending ? (
            <span className="search-connection__time">
              마지막 확인{" "}
              {checkedAt.toLocaleString("ko-KR", {
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          ) : null}
          {tone === "error" && !error && state?.errorId ? (
            <details className="search-connection__details">
              <summary>오류 정보 보기</summary>
              <p>오류 번호: {state.errorId}</p>
            </details>
          ) : null}
        </div>
      </div>
      <button
        className="search-connection__action"
        type="button"
        disabled={pending}
        onClick={recheck}
      >
        {pending
          ? "확인 중…"
          : tone === "error"
            ? "다시 연결 확인"
            : "연결 상태 새로고침"}
      </button>
    </section>
  );
}
