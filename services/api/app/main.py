from __future__ import annotations
import asyncio
import os
from contextlib import asynccontextmanager, suppress

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.services.search_connection import search_connection


@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(search_connection.probe())
    yield
    task.cancel()
    with suppress(asyncio.CancelledError):
        await task


app = FastAPI(title="Research Topic Validation API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:3002",
        "http://127.0.0.1:3002",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/v1")


@app.get("/health")
def health_check() -> dict:
    return {"status": "ok", "service": "research-topic-validation-api",
            "workspaceId": os.getenv("RESEARCH_WORKSPACE_ID"), "protocolVersion": 1}


@app.get("/health/search")
def search_health() -> dict:
    return dict(search_connection.state)


@app.post("/health/search/check")
async def check_search_health() -> dict:
    return await search_connection.probe()
