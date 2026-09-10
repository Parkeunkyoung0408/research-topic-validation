const statusLabels: Record<string, string> = {
  available: "사용 가능",
  not_available: "미구현",
  gold_set_required: "정답 평가 자료 필요",
  verification_required: "검증 데이터 필요",
  annotation_required: "연구자 평가 필요",
  done: "완료",
  pending: "대기",
  not_detected: "감지 안 됨",
  not_run: "미실행",
  not_verified: "미검증",
  covered: "연결된 근거 있음",
  not_covered: "연결된 근거 없음",
  annotated: "평가 기록 있음",
  needs_annotation: "연구자 평가 필요",
};

export function StatusBadge({ value }: { value: string }) {
  return <span className="status-badge">{statusLabels[value] ?? value}</span>;
}

export function getStatusLabel(value: string) {
  return statusLabels[value] ?? value;
}
