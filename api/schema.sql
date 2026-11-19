CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE TABLE IF NOT EXISTS bomfim_sessions (
    session_id UUID PRIMARY KEY,
    first_path TEXT NOT NULL,
    last_path TEXT NOT NULL,
    referrer_host TEXT,
    utm JSONB NOT NULL DEFAULT '{}'::jsonb,
    first_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    max_scroll SMALLINT NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS bomfim_sessions_active_idx ON bomfim_sessions(last_seen DESC);

CREATE TABLE IF NOT EXISTS bomfim_events (
    id BIGSERIAL PRIMARY KEY,
    session_id UUID REFERENCES bomfim_sessions(session_id) ON DELETE SET NULL,
    page_path TEXT NOT NULL,
    event_type TEXT NOT NULL,
    x REAL,
    y REAL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS bomfim_events_page_type_time_idx ON bomfim_events(page_path, event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS bomfim_events_session_time_idx ON bomfim_events(session_id, created_at DESC);
CREATE INDEX IF NOT EXISTS bomfim_events_heatmap_idx ON bomfim_events(page_path, event_type, created_at DESC) WHERE event_type IN ('click', 'pointer_move', 'scroll');

CREATE TABLE IF NOT EXISTS bomfim_coverage_base (
    id BIGSERIAL PRIMARY KEY,
    city TEXT NOT NULL,
    uf CHAR(2) NOT NULL,
    cep_from CHAR(8) NOT NULL,
    cep_to CHAR(8) NOT NULL,
    ibge INTEGER NOT NULL,
    unit_code TEXT NOT NULL,
    commercial_hub TEXT,
    area TEXT,
    availability TEXT NOT NULL CHECK (availability IN ('standard','exception')),
    UNIQUE(city, uf, cep_from, cep_to, unit_code)
);
CREATE INDEX IF NOT EXISTS bomfim_coverage_city_idx ON bomfim_coverage_base(uf, city);
CREATE INDEX IF NOT EXISTS bomfim_coverage_cep_idx ON bomfim_coverage_base(cep_from, cep_to);

CREATE TABLE IF NOT EXISTS bomfim_coverage_checks (
    id BIGSERIAL PRIMARY KEY,
    session_id UUID REFERENCES bomfim_sessions(session_id) ON DELETE SET NULL,
    page_path TEXT NOT NULL,
    query_type TEXT NOT NULL CHECK (query_type IN ('cep','city')),
    query_value TEXT NOT NULL,
    uf CHAR(2),
    coverage_status TEXT NOT NULL CHECK (coverage_status IN ('covered','conditional','not_covered','invalid')),
    unit_codes JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS bomfim_coverage_checks_time_idx ON bomfim_coverage_checks(created_at DESC, coverage_status);

CREATE TABLE IF NOT EXISTS bomfim_leads (
    id BIGSERIAL PRIMARY KEY,
    request_id UUID UNIQUE,
    session_id UUID REFERENCES bomfim_sessions(session_id) ON DELETE SET NULL,
    page_path TEXT NOT NULL,
    kind TEXT NOT NULL CHECK (kind IN ('cotacao','embarques-frequentes','comercial')),
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    origin TEXT,
    origin_cep TEXT,
    destination TEXT,
    destination_cep TEXT,
    test_mode BOOLEAN NOT NULL DEFAULT FALSE,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    utm JSONB NOT NULL DEFAULT '{}'::jsonb,
    notification_status TEXT NOT NULL DEFAULT 'pending' CHECK (notification_status IN ('pending','sent','failed')),
    client_receipt_status TEXT NOT NULL DEFAULT 'skipped' CHECK (client_receipt_status IN ('pending','sent','failed','skipped')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS bomfim_leads_time_kind_idx ON bomfim_leads(created_at DESC, kind);
CREATE INDEX IF NOT EXISTS bomfim_leads_session_idx ON bomfim_leads(session_id, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS bomfim_events_conversion_request_idx ON bomfim_events(session_id, ((payload->>'requestId'))) WHERE event_type='conversion' AND payload ? 'requestId';

CREATE OR REPLACE VIEW bomfim_landing_metrics_daily AS
WITH event_stats AS (
  SELECT page_path, created_at::date AS metric_date,
    COUNT(*) FILTER (WHERE event_type='page_view') AS page_views,
    COUNT(DISTINCT session_id) FILTER (WHERE event_type='page_view') AS unique_sessions,
    COUNT(*) FILTER (WHERE event_type='click') AS clicks,
    COUNT(*) FILTER (WHERE event_type='form_start') AS form_starts,
    COUNT(*) FILTER (WHERE event_type='form_submit') AS form_submits
  FROM bomfim_events GROUP BY page_path, created_at::date
), lead_stats AS (
  SELECT page_path, created_at::date AS metric_date, COUNT(*) FILTER (WHERE NOT test_mode) AS leads,
    COUNT(*) FILTER (WHERE test_mode) AS test_leads
  FROM bomfim_leads GROUP BY page_path, created_at::date
), keys AS (
  SELECT page_path, metric_date FROM event_stats UNION SELECT page_path, metric_date FROM lead_stats
)
SELECT k.page_path, k.metric_date, COALESCE(e.page_views,0) AS page_views, COALESCE(e.unique_sessions,0) AS unique_sessions,
  COALESCE(e.clicks,0) AS clicks, COALESCE(e.form_starts,0) AS form_starts, COALESCE(e.form_submits,0) AS form_submits,
  COALESCE(l.leads,0) AS leads, COALESCE(l.test_leads,0) AS test_leads,
  CASE WHEN COALESCE(e.unique_sessions,0)=0 THEN 0 ELSE ROUND(COALESCE(l.leads,0)::numeric/e.unique_sessions*100,2) END AS conversion_rate_percent
FROM keys k LEFT JOIN event_stats e USING(page_path,metric_date) LEFT JOIN lead_stats l USING(page_path,metric_date);

CREATE OR REPLACE VIEW bomfim_online_now AS
SELECT COUNT(*)::integer AS active_sessions FROM bomfim_sessions WHERE last_seen >= NOW() - INTERVAL '2 minutes';

CREATE OR REPLACE VIEW bomfim_heatmap_events AS
SELECT page_path, event_type, x, y, created_at, payload->>'control' AS control, payload->>'label' AS label
FROM bomfim_events WHERE event_type IN ('click','pointer_move','scroll');
