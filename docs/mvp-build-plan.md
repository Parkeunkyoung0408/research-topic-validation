# MVP Build Plan

## Sprint 1: Reproducible Search Foundation

Goal: a researcher can create a project, create a gap hypothesis, run an academic search, and see candidate papers with a search scope stamp.

Deliverables:

- `users`, `projects`, `gap_hypotheses`, `gap_conditions`, `search_runs`, `papers`, `search_results`
- OpenAlex source adapter
- Source scope stamp: source, query, language, document type, full-text policy, search date, result count
- Basic frontend workflow: topic input, condition review, search run result

Definition of done:

- Search results can be reproduced from stored query and scope
- Candidate papers are normalized separately from raw source payloads
- API responses use stable UUIDs and enum-like strings

## Sprint 2: Evidence Traceability

Add paper coding, evidence passages, gap evidence, and evidence roles.

## Sprint 3: 3-Gate Review

Add existence, value, and feasibility assessments as independent rows and UI cards.

Implemented MVP slice:

- Decision Link input
- Researcher Profile resource inputs
- `POST /v1/gaps/{gap_id}/assessments`
- `gate_assessments` persistence
- 3-Gate cards backed by saved assessment data

## Sprint 4: Human Decision Loop

Add rewrite options, researcher decisions, and re-verification loop.

Implemented MVP slice:

- `POST /v1/gaps/{gap_id}/rewrite-options`
- `POST /v1/gaps/{gap_id}/decisions`
- Rewrite actions: proceed, hold, reframe, differentiate
- Researcher decision persistence
- Child Gap version creation for reframe/differentiate selections
- Frontend option selection and revalidation handoff
