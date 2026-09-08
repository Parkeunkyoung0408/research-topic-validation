const statusLabels: Record<string, string> = {
  available: "사용 가능",
  not_available: "미구현",
  gold_set_required: "Gold Set 필요",
  verification_required: "검증 데이터 필요",
  annotation_required: "Annotation 필요",
  done: "완료",
  pending: "대기",
  not_detected: "감지 안 됨",
  not_run: "미실행",
  not_verified: "미검증",
  covered: "Coverage 있음",
  not_covered: "Coverage 없음",
  annotated: "Annotation 있음",
  needs_annotation: "Annotation 필요",
};

export function StatusBadge({ value }: { value: string }) {
  return <span className="status-badge">{statusLabels[value] ?? value}</span>;
}

export function getStatusLabel(value: string) {
  return statusLabels[value] ?? value;
}
