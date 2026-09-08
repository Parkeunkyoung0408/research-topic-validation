import type { ValidationWorkspaceController } from "../hooks/useValidationWorkspace";
import { ResourceReview } from "./ResourceReview";
import { TopicRewrite } from "./TopicRewrite";

type NextActionsProps = {
  workspace: Omit<
    ValidationWorkspaceController,
    "topic" | "handleTopicChange" | "handleSearch" | "handleNewTopic"
  >;
};

export function NextActions({ workspace }: NextActionsProps) {
  const { activeAction, isPending, handleSelectAction } = workspace;
  return (
    <section className="review-section" aria-labelledby="next-actions">
      <p className="section-kicker">03 · 다음 행동</p>
      <h2 id="next-actions">이 주제를 어떻게 이어갈까요?</h2>
      <div className="button-row">
        <button
          className="button"
          disabled={isPending}
          aria-expanded={activeAction === "rewrite"}
          aria-controls="action-content"
          onClick={() =>
            handleSelectAction(activeAction === "rewrite" ? null : "rewrite")
          }
        >
          주제 수정하기
        </button>
        <button
          className="button secondary-button"
          disabled={isPending}
          aria-expanded={activeAction === "resources"}
          aria-controls="action-content"
          onClick={() =>
            handleSelectAction(
              activeAction === "resources" ? null : "resources",
            )
          }
        >
          연구 준비 점검하기
        </button>
        <button
          className="text-button"
          disabled={isPending}
          aria-expanded={activeAction === "hold"}
          aria-controls="action-content"
          onClick={() =>
            handleSelectAction(activeAction === "hold" ? null : "hold")
          }
        >
          보류하기
        </button>
      </div>
      <div id="action-content">
        {workspace.status.message ? (
          <p
            role={workspace.status.error ? "alert" : "status"}
            className={`status ${workspace.status.error ? "error" : ""}`}
          >
            {workspace.status.message}
          </p>
        ) : null}
        {activeAction === "rewrite" ? (
          <TopicRewrite
            topic={workspace.rewriteText}
            options={workspace.rewriteOptions}
            isPending={isPending}
            onTopicChange={workspace.handleRewriteTextChange}
            onSuggestions={workspace.handleRewriteSuggestions}
            onSubmit={workspace.handleRewrite}
          />
        ) : null}
        {activeAction === "resources" ? (
          <ResourceReview workspace={workspace} />
        ) : null}
        {activeAction === "hold" ? (
          <form
            className="action-form"
            onSubmit={(event) => {
              event.preventDefault();
              workspace.handleDecision("HOLD");
            }}
          >
            <label className="field">
              보류 이유 (선택)
              <textarea
                className="textarea compact"
                value={workspace.rationale}
                disabled={isPending}
                onChange={(event) =>
                  workspace.handleRationaleChange(event.target.value)
                }
              />
            </label>
            <button className="button" disabled={isPending}>
              보류 결정 저장
            </button>
          </form>
        ) : null}
      </div>
    </section>
  );
}
