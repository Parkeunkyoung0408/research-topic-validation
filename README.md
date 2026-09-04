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
