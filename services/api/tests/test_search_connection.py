import unittest
from unittest.mock import AsyncMock, patch

import httpx

from app.services.search_connection import SearchConnection, classify_error
from app.services.search_service import SearchService
from app.repositories.in_memory import InMemoryStore
from app.domain.models import GapHypothesis
from app.schemas.requests import RunSearchRequest


class ClassificationTests(unittest.TestCase):
    def test_status_codes(self):
        for status, expected in [(401, "AUTH_FAILED"), (403, "AUTH_FAILED"),
                                 (429, "RATE_LIMITED"), (503, "UPSTREAM_ERROR"), (400, "REQUEST_REJECTED")]:
            response = httpx.Response(status, request=httpx.Request("GET", "https://example.org"))
            with self.subTest(status=status):
                self.assertEqual(classify_error(httpx.HTTPStatusError("error", request=response.request, response=response)), (expected, status))

    def test_transport_errors(self):
        self.assertEqual(classify_error(httpx.ReadTimeout("timeout"))[0], "TIMEOUT")
        self.assertEqual(classify_error(httpx.ConnectError("DNS failure"))[0], "NETWORK_ERROR")
        self.assertEqual(classify_error(httpx.ConnectError("[WinError 10013] denied"))[0], "ACCESS_DENIED")
        self.assertEqual(classify_error(ValueError("bad JSON"))[0], "INVALID_RESPONSE")

    def test_logs_exclude_sensitive_exception_content(self):
        monitor = SearchConnection()
        with self.assertLogs("uvicorn.error", level="WARNING") as logs:
            state = monitor.record(httpx.ConnectError("secret-query api_key=secret"), operation="search", duration_ms=1)
        self.assertNotIn("secret", "".join(logs.output))
        self.assertIn(state["errorId"], "".join(logs.output))


class ProbeTests(unittest.IsolatedAsyncioTestCase):
    async def test_probe_is_cached_and_does_not_store_search(self):
        monitor = SearchConnection()
        with patch("app.services.search_connection.OpenAlexAdapter.search", new_callable=AsyncMock, return_value=[]) as search:
            first = await monitor.probe()
            second = await monitor.probe()
        self.assertEqual(first["status"], "available")
        self.assertEqual(first, second)
        search.assert_awaited_once_with("science", 1)

    async def test_failure_and_recovery(self):
        monitor = SearchConnection()
        with patch("app.services.search_connection.OpenAlexAdapter.search", new_callable=AsyncMock, side_effect=httpx.ReadTimeout("timeout")):
            self.assertEqual((await monitor.probe())["code"], "TIMEOUT")
        monitor._last_probe = float("-inf")
        with patch("app.services.search_connection.OpenAlexAdapter.search", new_callable=AsyncMock, return_value=[]):
            recovered = await monitor.probe()
        self.assertEqual(recovered["status"], "available")
        self.assertIsNone(recovered["errorId"])

    async def test_search_failure_preserves_safe_error_reference(self):
        store = InMemoryStore()
        gap = GapHypothesis(project_id="test", gap_text="test")
        store.gaps[gap.id] = gap
        adapter = AsyncMock()
        adapter.search.side_effect = httpx.ReadTimeout("sensitive query")
        result = await SearchService(store, adapter).run_openalex_search(gap.id, RunSearchRequest(query="test"))
        self.assertEqual(result.source_scope["connectionError"]["code"], "TIMEOUT")
        self.assertTrue(result.source_scope["connectionError"]["errorId"])
        self.assertNotIn("sensitive", str(result.source_scope))


if __name__ == "__main__":
    unittest.main()
