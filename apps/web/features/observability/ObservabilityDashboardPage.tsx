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

const viewLabels = [
  "Overview",
  "Search Quality",
  "Evidence Quality",
  "Decision Quality",
  "Evaluation Dataset",
] as const;
type ObservabilityView = (typeof viewLabels)[number];

export function ObservabilityDashboardPage() {
  const [activeView, setActiveView] = useState<ObservabilityView>("Overview");
  const [dashboard, setDashboard] = useState<ObservabilityDashboard | null>(
    null,
  );
  const [message, setMessage] = useState("관측 데이터를 불러오는 중입니다.");
  const [isPending, startTransition] = useTransition();

  async function loadDashboard() {
    const nextDashboard = await getLatestObservabilityDashboard();
    setDashboard(nextDashboard);
    setMessage(
      nextDashboard.gapId
        ? "최근 Gap 검증 실행을 기준으로 표시합니다."
        : "아직 검증 실행 데이터가 없습니다.",
    );
  }

  useEffect(() => {
    loadDashboard().catch(() => {
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
          "Annotation을 저장했습니다. 이 데이터는 향후 Gold Set 후보로 사용됩니다.",
        );
      } catch {
        setMessage(
          "Annotation을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.",
        );
      }
    });
  }

  return (
    <main className="observability-shell">
      <aside className="observability-sidebar">
        <div>
          <h1 className="observability-title">
            Evidence Pipeline Observability
          </h1>
          <p className="small-text">Search → Evidence → Decision 추적</p>
        </div>
        <nav className="observability-nav" aria-label="Observability views">
          {viewLabels.map((view) => (
            <button
              className={`nav-item ${activeView === view ? "active" : ""}`}
              key={view}
              type="button"
              onClick={() => setActiveView(view)}
            >
              {view}
            </button>
          ))}
        </nav>
        <Link className="nav-link" href="/">
          검증 화면으로 이동
        </Link>
      </aside>

      <section className="observability-main">
        <header className="observability-header">
          <div>
            <h2>{activeView}</h2>
            <p className="small-text">{message}</p>
          </div>
          <button
            className="button secondary-button"
            type="button"
            disabled={isPending}
            onClick={handleRefresh}
          >
            새로고침
          </button>
        </header>
        {dashboard ? (
          <ObservabilityViewContent
            activeView={activeView}
            dashboard={dashboard}
            isPending={isPending}
            onAnnotate={handleAnnotate}
          />
        ) : (
          <div className="empty">대시보드를 불러오고 있습니다.</div>
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
    case "Overview":
      return <OverviewView dashboard={dashboard} />;
    case "Search Quality":
      return <SearchQualityView dashboard={dashboard} />;
    case "Evidence Quality":
      return (
        <EvidenceQualityView
          items={dashboard.evidenceQuality}
          isPending={isPending}
          onAnnotate={onAnnotate}
        />
      );
    case "Decision Quality":
      return <DecisionQualityView items={dashboard.decisionQuality} />;
    case "Evaluation Dataset":
      return (
        <EvaluationDatasetView
          dashboard={dashboard}
          isPending={isPending}
          onAnnotate={onAnnotate}
        />
      );
  }
}
