import type { RewriteOption } from "@research-topic-validation/contracts";

type TopicRewriteProps = {
  topic: string;
  options: RewriteOption[];
  isPending: boolean;
  onTopicChange: (value: string) => void;
  onSuggestions: () => void;
  onSubmit: () => void;
};

export function TopicRewrite({
  topic,
  options,
  isPending,
  onTopicChange,
  onSuggestions,
  onSubmit,
}: TopicRewriteProps) {
  return (
    <form
      className="action-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      {options.length ? (
        <label className="field">
          수정 방향 (선택)
          <select
            className="input"
            disabled={isPending}
            value={
              options.find((option) => option.rewrittenGapText === topic)?.id ??
              ""
            }
            onChange={(event) => {
              const option = options.find(
                (item) => item.id === event.target.value,
              );
              if (option) onTopicChange(option.rewrittenGapText);
            }}
          >
            <option value="">직접 수정하기</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.title}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <button
          className="text-button"
          type="button"
          disabled={isPending}
          onClick={onSuggestions}
        >
          수정 방향 제안 보기
        </button>
      )}
      <label className="field">
        수정할 연구 주제
        <textarea
          className="textarea"
          required
          disabled={isPending}
          value={topic}
          onChange={(event) => onTopicChange(event.target.value)}
        />
      </label>
      <button className="button" disabled={isPending}>
        수정한 주제로 다시 검색
      </button>
    </form>
  );
}
