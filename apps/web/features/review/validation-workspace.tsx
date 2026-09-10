"use client";

import { useValidationWorkspace } from "./hooks/useValidationWorkspace";
import { TopicEntry } from "./components/TopicEntry";
import { ReviewResults } from "./components/ReviewResults";
import { NextActions } from "./components/NextActions";
import { SearchConnectionBanner } from "../shared/SearchConnectionBanner";

export function ValidationWorkspace() {
  const workspace = useValidationWorkspace();
  return (
    <main className="research-workspace">
      <header className="topbar">
        <span className="brand-title">연구 주제 검토</span>
        {workspace.result ? (
          <button
            className="button secondary-button"
            disabled={workspace.isPending}
            onClick={workspace.handleNewTopic}
          >
            새 주제 검토
          </button>
        ) : null}
      </header>
      <div className="research-content">
        <SearchConnectionBanner />
        {!workspace.result && workspace.status.message ? (
          <p
            role={workspace.status.error ? "alert" : "status"}
            className={`status ${workspace.status.error ? "error" : ""}`}
          >
            {workspace.status.message}
          </p>
        ) : null}
        {workspace.result ? (
          <>
            <ReviewResults result={workspace.result} />
            <NextActions workspace={workspace} />
          </>
        ) : (
          <TopicEntry
            topic={workspace.topic}
            isPending={workspace.isPending}
            onTopicChange={workspace.handleTopicChange}
            onSubmit={workspace.handleSearch}
          />
        )}
      </div>
    </main>
  );
}
