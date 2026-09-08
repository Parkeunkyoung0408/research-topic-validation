type TopicEntryProps = {
  topic: string;
  isPending: boolean;
  onTopicChange: (value: string) => void;
  onSubmit: () => void;
};

export function TopicEntry({
  topic,
  isPending,
  onTopicChange,
  onSubmit,
}: TopicEntryProps) {
  return (
    <section className="topic-entry">
      <h1>
        <label htmlFor="research-topic">어떤 주제를 연구하고 싶나요?</label>
      </h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <textarea
          id="research-topic"
          className="textarea"
          value={topic}
          disabled={isPending}
          onChange={(event) => onTopicChange(event.target.value)}
          placeholder="예: 생성형 AI가 UX 디자이너의 아이디어 다양성에 미치는 영향"
          required
        />
        <button className="button" disabled={isPending} type="submit">
          {isPending ? "선행연구 검색 중…" : "선행연구 검토 시작"}
        </button>
      </form>
    </section>
  );
}
