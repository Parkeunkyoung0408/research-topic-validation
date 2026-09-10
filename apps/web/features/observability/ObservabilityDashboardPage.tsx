"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import type {
  ObservabilityDashboard,
  ResearcherAnnotationInput,
} from "@research-topic-validation/contracts";
import {
  createResearcherAnnotation,
  getLatestObservabilityDashboard,
} from "../../lib/api";
import { DecisionQualityView } from "./views/DecisionQualityView";
import { EvaluationDatasetView } from "./views/EvaluationDatasetView";
import { EvidenceQualityView } from "./views/EvidenceQualityView";
import { OverviewView } from "./views/OverviewView";
import { SearchQualityView } from "./views/SearchQualityView";
import { SearchConnectionBanner } from "../shared/SearchConnectionBanner";

const viewLabels = [
  "검토 요약",
  "검색 과정",
  "논문 근거 검토",
  "판단 기록",
  "연구자 평가",
] as const;
type ObservabilityView = (typeof viewLabels)[number];

export function ObservabilityDashboardPage() {
  const [activeView, setActiveView] = useState<ObservabilityView>("검토 요약");
  const [dashboard, setDashboard] = useState<ObservabilityDashboard | null>(
    null,
  );
  const [message, setMessage] = useState("관측 데이터를 불러오는 중입니다.");
  const [hasLoadError, setHasLoadError] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function loadDashboard() {
    const nextDashboard = await getLatestObservabilityDashboard();
    setDashboard(nextDashboard);
    setHasLoadError(false);
    setMessage(
      nextDashboard.gapId
        ? "가장 최근에 생성한 연구 주제의 기록입니다."
        : "아직 검증 실행 데이터가 없습니다.",
    );
  }

  useEffect(() => {
    loadDashboard().catch(() => {
      setHasLoadError(true);
      setMessage(
        "대시보드 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
      );
    });
  }, []);

  function handleRefresh() {
    startTransition(async () => {
      try {
        await loadDashboard();
      } catch {
        setHasLoadError(true);
        setMessage(
          "대시보드 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
        );
      }
    });
  }

  function handleAnnotate(
    gapEvidenceId: string,
    input: ResearcherAnnotationInput,
  ) {
    startTransition(async () => {
      try {
        await createResearcherAnnotation(gapEvidenceId, input);
        await loadDashboard();
        setMessage(
          "연구자 평가를 저장했습니다. 평가 지표는 아직 계산하지 않습니다.",
        );
      } catch {
        setMessage(
          "연구자 평가를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.",
        );
      }
    });
  }

  return (
    <main className="observability-shell">
      <aside className="observability-sidebar">
        <div>
          <h1 className="observability-title">검색 근거 검토</h1>
          <p className="small-text">
            검색 기록을 확인하고 논문 근거를 평가하세요.
          </p>
        </div>
        <nav className="observability-nav" aria-label="검토 메뉴">
          {viewLabels.map((view) => (
            <button
              className={`nav-item ${activeView === view ? "active" : ""}`}
              key={view}
              type="button"
              aria-current={activeView === view ? "page" : undefined}
              onClick={() => setActiveView(view)}
            >
              {view}
            </button>
          ))}
        </nav>
        <Link className="nav-link" href="/">
          새 연구 주제 검색
        </Link>
      </aside>

      <section className="observability-main">
        <header className="observability-header">
          <div>
            <h2>{activeView}</h2>
            <p className="small-text" role="status">
              {message}
            </p>
          </div>
          <button
            className="button secondary-button"
            type="button"
            disabled={isPending}
            onClick={handleRefresh}
          >
            {isPending ? "처리 중…" : "기록 새로고침"}
          </button>
        </header>
        <SearchConnectionBanner />
        <section className="observability-card">
          <h3>이 화면에서 확인할 수 있는 것</h3>
          <p>
            검색 기록 → 수집된 논문과 자동 분류 → 연구자 평가를 차례로
            확인하세요. 분류는 제목·초록의 단어 일치 규칙을 사용하며, 검색
            정확도나 연구의 독창성을 증명하지 않습니다.
          </p>
          <p>
            현재 기록은 서버 메모리에 저장되어 서버 재시작 시 사라집니다. 논문
            제목·인용 문장·검색어는 원문 그대로 표시합니다.
          </p>
        </section>
        {dashboard?.gapId ? (
          <ObservabilityViewContent
            activeView={activeView}
            dashboard={dashboard}
            isPending={isPending}
            onAnnotate={handleAnnotate}
          />
        ) : dashboard ? (
          <div className="empty">
            <p>
              검토할 검색 기록이 없습니다. 연구 주제를 검색한 뒤 돌아와 기록을
              새로고침하세요.
            </p>
            <Link className="nav-link" href="/">
              연구 주제 검색하기
            </Link>
          </div>
        ) : hasLoadError ? (
          <div className="empty">
            서버 연결에 실패했습니다. 상단의 기록 새로고침으로 다시 시도하세요.
          </div>
        ) : (
          <div className="empty">대시보드를 불러오는 중…</div>
        )}
      </section>
    </main>
  );
}

type ObservabilityViewContentProps = {
  activeView: ObservabilityView;
  dashboard: ObservabilityDashboard;
  isPending: boolean;
  onAnnotate: (gapEvidenceId: string, input: ResearcherAnnotationInput) => void;
};

function ObservabilityViewContent({
  activeView,
  dashboard,
  isPending,
  onAnnotate,
}: ObservabilityViewContentProps) {
  switch (activeView) {
    case "검토 요약":
      return <OverviewView dashboard={dashboard} />;
    case "검색 과정":
      return <SearchQualityView dashboard={dashboard} />;
    case "논문 근거 검토":
      return (
        <EvidenceQualityView
          items={dashboard.evidenceQuality}
          isPending={isPending}
          onAnnotate={onAnnotate}
        />
      );
    case "판단 기록":
      return <DecisionQualityView items={dashboard.decisionQuality} />;
    case "연구자 평가":
      return (
        <EvaluationDatasetView
          dashboard={dashboard}
          isPending={isPending}
          onAnnotate={onAnnotate}
        />
      );
  }
}
