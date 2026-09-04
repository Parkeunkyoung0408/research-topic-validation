# Evidence Pipeline Observability Dashboard

## Current Data Already Collected

- `search_runs`: source scope, query snapshot, result count, search date
- `search_results`: paper candidates, rank, source, raw result
- `papers`: normalized paper metadata
- `evidence_passages`: original passage text and source location fields
- `gap_evidence`: gap-paper relation and matched/mismatched conditions
- `gap_evidence_roles`: Counter, Motivating, Enabling, Related roles
- `gate_assessments`: Existence, Value, Feasibility assessment records
- `rewrite_options`: rewrite candidates
- `researcher_decisions`: researcher decision and child gap reference

## Additional Data To Store

- `researcher_annotations`: researcher labels for relevance and evidence relation

## DB Changes

- Add `researcher_annotations`.
- Reuse existing pipeline tables instead of duplicating search, evidence, or decision records.
- Keep the provenance chain: Paper -> Original Passage -> AI Evidence Claim -> Gap Evidence -> Gate Assessment -> Researcher Decision.

## API Changes

- `GET /v1/observability/latest`
- `GET /v1/observability/gaps/{gap_id}`
- `POST /v1/gap-evidence/{gap_evidence_id}/annotations`

## Dashboard Structure

- `/observability`
- Sidebar views: Overview, Search Quality, Evidence Quality, Decision Quality, Evaluation Dataset

## Metric Policy

Do not generate synthetic quality scores. Recall, Precision, nDCG, Grounded Rate, Unsupported Claim Rate, Citation Correctness, Evidence Extraction Accuracy, Agreement Rate, and Override Rate are exposed only as unavailable metric interfaces until Gold Set or verified annotation data exists.
