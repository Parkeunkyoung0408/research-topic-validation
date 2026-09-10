from __future__ import annotations
"""Connection status shared by startup probes and real searches. Never log query URLs."""
import asyncio
import json
import logging
from datetime import datetime, timezone
from time import monotonic
from uuid import uuid4

import httpx

from app.adapters.academic_sources.openalex import OpenAlexAdapter

logger = logging.getLogger("uvicorn.error")
MESSAGES = {
    "ACCESS_DENIED": "서버의 외부 네트워크 접근이 차단되었습니다. 실행 권한이나 방화벽 설정을 확인해 주세요.",
    "TIMEOUT": "논문 서비스 응답 시간이 초과됐습니다. 잠시 후 다시 시도해 주세요.",
    "RATE_LIMITED": "논문 서비스 요청 한도를 초과했습니다. 잠시 후 다시 시도해 주세요.",
    "AUTH_FAILED": "논문 서비스 인증에 실패했습니다. 서버의 연결 설정을 확인해 주세요.",
    "UPSTREAM_ERROR": "논문 서비스에 일시적인 장애가 있습니다. 잠시 후 다시 시도해 주세요.",
    "NETWORK_ERROR": "논문 서비스에 연결할 수 없습니다. 서버의 인터넷·DNS 연결을 확인해 주세요.",
    "INVALID_RESPONSE": "논문 서비스가 예상과 다른 응답을 반환했습니다. 관리자에게 오류 번호를 알려 주세요.",
    "REQUEST_REJECTED": "논문 서비스가 검색 요청을 거부했습니다. 검색 조건과 서버 설정을 확인해 주세요.",
}


def classify_error(exc: Exception) -> tuple[str, int | None]:
    if isinstance(exc, httpx.HTTPStatusError):
        status = exc.response.status_code
        return ("RATE_LIMITED" if status == 429 else
                "AUTH_FAILED" if status in (401, 403) else
                "UPSTREAM_ERROR" if status >= 500 else "REQUEST_REJECTED"), status
    if isinstance(exc, httpx.TimeoutException):
        return "TIMEOUT", None
    current = exc
    seen: set[int] = set()
    while current and id(current) not in seen:
        seen.add(id(current))
        if (getattr(current, "winerror", None) == 10013 or
                getattr(current, "errno", None) in (13, 10013) or "10013" in str(current)):
            return "ACCESS_DENIED", None
        current = current.__cause__ or current.__context__
    if isinstance(exc, httpx.TransportError):
        return "NETWORK_ERROR", None
    return "INVALID_RESPONSE", None


class SearchConnection:
    def __init__(self) -> None:
        self.state: dict = {"status": "checking", "message": "논문 검색 연결을 확인하는 중입니다.", "checkedAt": None}
        self._lock = asyncio.Lock()
        self._last_probe = float("-inf")

    def record(self, exc: Exception | None, *, operation: str, duration_ms: int) -> dict:
        checked_at = datetime.now(timezone.utc).isoformat()
        code, status = classify_error(exc) if exc else (None, None)
        error_id = uuid4().hex[:12] if exc else None
        self.state = {
            "status": "unavailable" if exc else "available",
            "code": code, "message": MESSAGES[code] if code else "논문 검색 연결이 정상입니다.",
            "checkedAt": checked_at, "errorId": error_id,
        }
        # No exception text, query, API key or upstream response body in logs.
        logger.log(logging.WARNING if exc else logging.INFO, json.dumps({
            "event": "search_connection", "operation": operation, "at": checked_at,
            "code": code, "errorId": error_id, "httpStatus": status,
            "durationMs": duration_ms, "exceptionType": type(exc).__name__ if exc else None,
        }, ensure_ascii=False))
        return dict(self.state)

    async def probe(self) -> dict:
        async with self._lock:
            # Repeated page visits or button clicks must not flood the upstream service.
            if monotonic() - self._last_probe < 30:
                return dict(self.state)
            started = monotonic()
            try:
                await OpenAlexAdapter().search("science", 1)
            except (httpx.HTTPError, ValueError, TypeError, KeyError) as exc:
                result = self.record(exc, operation="probe", duration_ms=int((monotonic() - started) * 1000))
            else:
                result = self.record(None, operation="probe", duration_ms=int((monotonic() - started) * 1000))
            self._last_probe = monotonic()
            return result


search_connection = SearchConnection()
