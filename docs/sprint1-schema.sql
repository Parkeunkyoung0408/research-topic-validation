create table users (
  id uuid primary key,
  email text unique,
  created_at timestamptz not null default now()
);

create table projects (
  id uuid primary key,
  user_id uuid references users(id),
  title text not null,
  description text,
  created_at timestamptz not null default now()
);

create table researcher_profiles (
  id uuid primary key,
  project_id uuid not null references projects(id),
  available_data text,
  participants text,
  tools text,
  time_budget text,
  collaboration text,
  notes text,
  created_at timestamptz not null default now()
);

create table gap_hypotheses (
  id uuid primary key,
  project_id uuid not null references projects(id),
  parent_gap_id uuid references gap_hypotheses(id),
  version_no integer not null default 1,
  gap_text text not null,
  research_mode text,
  gap_type text,
  status text not null default 'DRAFT',
  created_at timestamptz not null default now()
);

create table gap_conditions (
  id uuid primary key,
  gap_id uuid not null references gap_hypotheses(id),
  label text not null,
  role text not null,
  mechanism text,
  justification text,
  is_load_bearing boolean not null default false,
  sort_order integer not null default 0
);

create table search_runs (
  id uuid primary key,
  gap_id uuid not null references gap_hypotheses(id),
  source_scope jsonb not null,
  year_from integer,
  year_to integer,
  languages text[] not null default '{}',
  document_types text[] not null default '{}',
  fulltext_policy text not null default 'ABSTRACT_OR_FULLTEXT',
  query_snapshot jsonb not null,
  search_budget jsonb not null default '{}',
  model_versions jsonb not null default '{}',
  result_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table papers (
  id uuid primary key,
  doi text,
  openalex_id text unique,
  title text not null,
  abstract text,
  publication_year integer,
  language text,
  document_type text,
  oa_status text,
  metadata_json jsonb not null default '{}'
);

create table search_results (
  id uuid primary key,
  search_run_id uuid not null references search_runs(id),
  paper_id uuid not null references papers(id),
  source text not null,
  rank integer not null,
  score double precision,
  raw_result jsonb not null default '{}'
);

create table project_documents (
  id uuid primary key,
  project_id uuid not null references projects(id),
  file_name text not null,
  storage_path text,
  source_type text not null default 'USER_UPLOAD',
  created_at timestamptz not null default now()
);

create table paper_codings (
  id uuid primary key,
  paper_id uuid not null references papers(id),
  coding_schema_version text not null,
  research_mode text,
  population_json jsonb not null default '{}',
  context_json jsonb not null default '{}',
  method_json jsonb not null default '{}',
  outcomes_json jsonb not null default '{}',
  claims_json jsonb not null default '{}',
  limitations_json jsonb not null default '{}',
  resources_json jsonb not null default '{}'
);

create table paper_chunks (
  id uuid primary key,
  paper_id uuid not null references papers(id),
  chunk_text text not null,
  section text,
  token_count integer,
  embedding_model text,
  embedding_vector vector
);

create table evidence_passages (
  id uuid primary key,
  paper_id uuid not null references papers(id),
  document_id uuid references project_documents(id),
  section text,
  page_no integer,
  start_offset integer,
  end_offset integer,
  passage_text text not null
);

create table gap_evidence (
  id uuid primary key,
  gap_id uuid not null references gap_hypotheses(id),
  paper_id uuid not null references papers(id),
  overlap_grade text not null,
  strength double precision not null,
  matched_conditions_json jsonb not null default '[]',
  mismatched_conditions_json jsonb not null default '[]',
  classifier_version text not null
);

create table gap_evidence_roles (
  id uuid primary key,
  gap_evidence_id uuid not null references gap_evidence(id),
  role_type text not null,
  confidence double precision not null
);

create table gap_evidence_passages (
  id uuid primary key,
  gap_evidence_id uuid not null references gap_evidence(id),
  passage_id uuid not null references evidence_passages(id)
);

create table gate_assessments (
  id uuid primary key,
  gap_id uuid not null references gap_hypotheses(id),
  search_run_id uuid references search_runs(id),
  gate_type text not null,
  status text not null,
  grade text,
  rationale text not null,
  rule_version text not null,
  overridden boolean not null default false,
  inputs_json jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table rewrite_options (
  id uuid primary key,
  gap_id uuid not null references gap_hypotheses(id),
  action text not null,
  title text not null,
  rewritten_gap_text text not null,
  rationale text not null,
  created_at timestamptz not null default now()
);

create table researcher_decisions (
  id uuid primary key,
  gap_id uuid not null references gap_hypotheses(id),
  rewrite_option_id uuid references rewrite_options(id),
  new_gap_id uuid references gap_hypotheses(id),
  action text not null,
  rationale text,
  created_at timestamptz not null default now()
);

create table researcher_annotations (
  id uuid primary key,
  gap_evidence_id uuid not null references gap_evidence(id),
  relevance_label text not null,
  relation_label text not null,
  notes text,
  created_at timestamptz not null default now()
);
