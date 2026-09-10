# Research Topic Validation

Evidence-based research decision support for validating whether a research topic is novel, valuable, and feasible.

## Current Scope

This repository starts with the MVP Sprint 1 foundation from the product document:

- Project and gap creation
- Gap condition tracking
- OpenAlex-based academic search adapter
- Search run persistence with scope stamps
- Next.js operator UI for starting a validation run
- FastAPI service boundaries that keep domain rules outside routes

## Structure

```text
apps/web                 Next.js frontend
services/api             FastAPI backend
packages/contracts       Shared TypeScript API contracts
docs                     Planning and schema notes
```

## Local Development

### 통합 실행 (권장)

프론트 의존성(`npm.cmd install`)과 아래 Python 의존성을 설치한 뒤 프로젝트 루트의 **외부 인터넷 접근이 허용된 터미널**에서 실행합니다.

```powershell
npm.cmd run dev
```

- 검색 화면: http://localhost:3000
- 검색 근거 대시보드: http://localhost:3000/observability
- 실행 로그: `.runtime/api.log`, `.runtime/web.log` (실행마다 이어 쓰기)
- 종료: 실행한 터미널에서 `Ctrl+C`. 이 명령이 시작한 프로세스만 종료하며 재사용한 서버는 유지합니다.

실행 순서: 두 포트 확인 → 의존성 확인 → 백엔드 시작 → 백엔드에서 실제 OpenAlex 검색 점검 → 프론트 시작. 연결 점검이 실패해도 화면을 열어 오류와 재점검 버튼을 제공합니다. 공개 테스트 검색어는 검색 기록에 저장하지 않습니다.

3000·8000은 고정입니다. 프로젝트 식별 정보가 일치하는 서버만 재사용하며, 기존 방식으로 켠 서버나 다른 프로그램이 점유하면 종료나 포트 변경 없이 안내하고 중단합니다. 최초 전환 시 기존 서버를 실행한 터미널에서 종료해야 합니다. **현재 저장소는 메모리 방식이므로 백엔드 종료 시 검색·평가 기록이 사라집니다.** 통합 실행은 영구 저장 기능을 추가하지 않습니다.

Python은 `services/api/.venv`가 있으면 우선 사용하고 없으면 `python`을 사용합니다. 다른 인터프리터를 사용할 때는 `RESEARCH_PYTHON`에 실행 파일 경로를 지정하세요. 자동 코드 재시작은 사용하지 않으므로 백엔드 수정 후에는 수동 재실행이 필요합니다.

### 연결 진단

- `GET /health`: 백엔드 프로세스와 프로젝트 식별 정보. 외부 연결 정상이라는 의미는 아닙니다.
- `GET /health/search`: 마지막 연결 상태·확인 시각·오류 번호. 외부 요청 없이 조회합니다.
- `POST /health/search/check`: 실제 검색 연결 재점검. 동시 요청은 합치고 30초 이내 재점검은 캐시를 반환합니다.
- 실제 검색 요청도 같은 오류 분류를 사용합니다. 접근 거부·시간 초과·요청 한도·인증 실패·외부 장애·네트워크 장애·잘못된 응답을 구분합니다. 외부 403 응답은 인증 또는 접근 정책 문제일 수 있으므로 서비스 계정·접근 정책을 함께 확인하세요.
- 화면에 나온 오류 번호를 `.runtime/api.log`에서 찾으면 발생 시각·HTTP 상태·소요 시간을 확인할 수 있습니다. 검색어·키·원문 응답·예외 URL은 진단 로그에 쓰지 않습니다.
- 네트워크 권한 제한은 실행 스크립트가 해제하지 않습니다. 접근 거부 시 승인된 실행 환경을 사용하세요. 자동 재시도로 요청 한도를 더 소모하지 않도록 검색 자동 재시도는 하지 않습니다.

### 개발 검증

```powershell
npm.cmd run typecheck --workspace apps/web
npm.cmd run test --workspace apps/web
cd services/api
python -m unittest discover -s tests
```

### 개별 실행 (개발용)

Frontend:

```bash
npm.cmd install
npm.cmd run dev:web
```

Backend:

```bash
cd services/api
python -m venv .venv
.venv\Scripts\python -m pip install -r requirements.txt
.venv\Scripts\python -m uvicorn app.main:app --reload --port 8000
```

The frontend expects the API at `http://localhost:8000` unless `NEXT_PUBLIC_API_BASE_URL` is set.
