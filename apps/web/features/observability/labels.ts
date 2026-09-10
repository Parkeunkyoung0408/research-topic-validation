// Translate system-generated labels only. Preserve paper titles, passages and queries.
const labels: Record<string, string> = {
  "Counter Evidence": "연구 공백에 대한 반대 근거 후보",
  "Counter-Evidence Recall": "반대 근거 재현율",
  "AI-Researcher Agreement Rate": "자동 판단과 연구자 판단의 일치율",
  "Unsupported Claim Rate": "근거 없는 주장 비율",
  "Evidence Extraction Accuracy": "근거 추출 정확도",
  "Citation Correctness": "인용 정확도",
  "Grounded Rate": "원문으로 뒷받침되는 주장 비율",
  "Override Rate": "연구자 판단 변경 비율",
  "Recall@10": "상위 10건 재현율",
  "Recall@20": "상위 20건 재현율",
  "Precision@10": "상위 10건 정밀도",
  "nDCG@10": "상위 10건 순위 품질",
  Reranker: "순위 재정렬",
  Rerank: "순위 재정렬",
  "Query Rewrite": "검색어 자동 수정",
  "Original Query": "검색어 기록",
  "Re-search": "재검색",
  "New Evidence": "근거 저장",
  Search: "검색",
  "Evidence roles": "근거 역할",
  Evidence: "근거",
  Coverage: "조건별 근거 연결",
  coverage: "조건별 근거 연결",
  "Gold Set": "정답 평가 자료",
  annotation: "연구자 평가",
  "Duration: long-term": "기간: 장기",
  "Context: actual work": "환경: 실제 업무",
  "Technology: generative AI": "기술: 생성형 인공지능",
  "User-confirmed core condition required":
    "연구자가 핵심 조건을 확인해야 합니다",
  CORE: "핵심 조건",
  CONTEXT: "맥락 조건",
  COUNTER: "연구 공백에 대한 반대 근거 후보",
  MOTIVATING: "연구 필요성 근거",
  ENABLING: "수행 방법·자원 근거",
  CALLS_FOR: "후속 연구 제안",
  RELATED: "관련 자료",
  DIRECT: "직접 중복 후보",
  Direct: "직접 중복 후보",
  ADJACENT: "인접 연구",
  P1: "부분 중복 1단계",
  P2: "부분 중복 2단계",
  EXISTING: "기존 연구 중복 후보 있음",
  NARROWING_REQUIRED: "연구 범위 축소 검토 필요",
  FRAGILE: "차별성 추가 검토 필요",
  NOVEL_WITHIN_SCOPE: "검색 범위 내 직접 중복 미발견",
  NO_EVIDENCE: "수집된 근거 없음",
  PREPARATION_REVIEWED: "준비 항목 검토됨",
  PENDING_DECISION_LINK: "연구 활용 목적 입력 필요",
  PENDING_PROFILE: "연구자 준비 정보 입력 필요",
  "Decision Link": "연구 활용 목적",
  "Motivating/Calls-for": "연구 필요성·후속 연구 제안",
  "Researcher Profile": "연구자 준비 정보",
  "Enabling/Data": "수행 방법·데이터",
};

const labelPattern = new RegExp(
  Object.keys(labels)
    .sort((a, b) => b.length - a.length)
    .map((key) => key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|"),
  "g",
);

export function localizeSystemText(value: string) {
  return value.replace(labelPattern, (key) => labels[key]);
}
