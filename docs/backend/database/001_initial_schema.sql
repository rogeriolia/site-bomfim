-- Bomfim: proposta inicial PostgreSQL 14+ para backend Python da equipe destinatária.
-- Documentação de entrega; não aplicada a nenhum servidor.
-- Executar com uma role de migração, nunca com credenciais do frontend.
BEGIN;
CREATE SCHEMA IF NOT EXISTS cms;
CREATE SCHEMA IF NOT EXISTS analytics;
CREATE SCHEMA IF NOT EXISTS crm_private;
REVOKE ALL ON SCHEMA crm_private FROM PUBLIC;

CREATE TABLE cms.assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL UNIQUE,
  alt_text text NOT NULL DEFAULT '',
  width integer CHECK (width > 0),
  height integer CHECK (height > 0),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE cms.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL UNIQUE CHECK (path LIKE '/%'),
  area text NOT NULL CHECK (area IN ('institutional','content','landing','conversion','utility')),
  page_type text NOT NULL CHECK (page_type IN ('home','service','route','article','listing','institutional','form','thank_you','utility')),
  title text NOT NULL,
  heading text NOT NULL,
  description text NOT NULL,
  hero_asset_id uuid REFERENCES cms.assets(id),
  social_asset_id uuid REFERENCES cms.assets(id),
  canonical_path text,
  indexable boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived')),
  content jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(content) = 'object'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE cms.campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  landing_page_id uuid NOT NULL REFERENCES cms.pages(id),
  target_audience text NOT NULL DEFAULT 'unknown' CHECK (target_audience IN ('unknown','prospect','customer','service_intent')),
  stage text NOT NULL CHECK (stage IN ('discovery','consideration','decision','return')),
  active boolean NOT NULL DEFAULT false
);
CREATE TABLE cms.forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  conversion_type text NOT NULL CHECK (conversion_type IN ('contact','quote','collection','route_plan','newsletter')),
  title text NOT NULL,
  active boolean NOT NULL DEFAULT false
);
CREATE TABLE cms.conversion_destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL REFERENCES cms.forms(id),
  context text NOT NULL CHECK (context IN ('institutional','landing')),
  campaign_id uuid REFERENCES cms.campaigns(id),
  thank_you_page_id uuid NOT NULL REFERENCES cms.pages(id),
  CHECK ((context = 'landing' AND campaign_id IS NOT NULL) OR (context = 'institutional' AND campaign_id IS NULL))
);
CREATE UNIQUE INDEX destination_institutional_unique ON cms.conversion_destinations(form_id) WHERE context = 'institutional';
CREATE UNIQUE INDEX destination_campaign_unique ON cms.conversion_destinations(form_id,campaign_id) WHERE context = 'landing';

-- Estes identificadores representam navegadores, não pessoas ou contas autenticadas.
CREATE TABLE analytics.visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE analytics.consent_receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id uuid REFERENCES analytics.visitors(id) ON DELETE CASCADE,
  analytics_allowed boolean NOT NULL,
  marketing_allowed boolean NOT NULL,
  policy_version text NOT NULL,
  source text NOT NULL CHECK (source IN ('banner','preferences','withdrawal')),
  recorded_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE analytics.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id uuid NOT NULL REFERENCES analytics.visitors(id) ON DELETE CASCADE,
  consent_receipt_id uuid NOT NULL REFERENCES analytics.consent_receipts(id),
  environment text NOT NULL CHECK (environment IN ('production','staging','development')),
  started_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  entry_page_id uuid REFERENCES cms.pages(id) ON DELETE SET NULL,
  entry_area text NOT NULL CHECK (entry_area IN ('institutional','content','landing','conversion','utility')),
  campaign_id uuid REFERENCES cms.campaigns(id) ON DELETE SET NULL,
  source text,
  medium text,
  campaign_code text,
  referrer_host text,
  device_category text CHECK (device_category IN ('desktop','mobile','tablet','unknown')),
  customer_status text NOT NULL DEFAULT 'unknown' CHECK (customer_status IN ('unknown','declared_customer','declared_prospect','confirmed_customer')),
  customer_status_source text CHECK (customer_status_source IN ('declaration','crm')),
  CHECK ((customer_status = 'unknown' AND customer_status_source IS NULL) OR (customer_status IN ('declared_customer','declared_prospect') AND customer_status_source = 'declaration') OR (customer_status = 'confirmed_customer' AND customer_status_source = 'crm')),
  CHECK (last_seen_at >= started_at)
);
CREATE TABLE analytics.page_views (
  id uuid PRIMARY KEY, -- UUID criado no cliente; repetição do POST não duplica a visualização.
  session_id uuid NOT NULL REFERENCES analytics.sessions(id) ON DELETE CASCADE,
  page_id uuid REFERENCES cms.pages(id) ON DELETE SET NULL,
  page_path text NOT NULL, -- Somente pathname normalizado, nunca query string ou hash.
  area text NOT NULL CHECK (area IN ('institutional','content','landing','conversion','utility')),
  page_type text NOT NULL,
  content_slug text,
  occurred_at timestamptz NOT NULL,
  active_seconds integer NOT NULL DEFAULT 0 CHECK (active_seconds >= 0),
  max_scroll_percent smallint NOT NULL DEFAULT 0 CHECK (max_scroll_percent BETWEEN 0 AND 100),
  UNIQUE (id,session_id)
);
CREATE TABLE analytics.events (
  id uuid PRIMARY KEY,
  session_id uuid NOT NULL REFERENCES analytics.sessions(id) ON DELETE CASCADE,
  page_view_id uuid,
  consent_receipt_id uuid NOT NULL REFERENCES analytics.consent_receipts(id),
  event_name text NOT NULL CHECK (event_name IN ('cta_click','form_start','form_error','form_submit_attempt','route_origin_select','route_destination_select','route_plan_open','content_engaged','content_complete','portal_outbound','phone_click','whatsapp_click')),
  occurred_at timestamptz NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now(),
  form_id uuid REFERENCES cms.forms(id),
  cta_id text, -- Chave editorial controlada, nunca texto digitado pelo visitante.
  field_key text, -- Apenas chave do campo com erro; nunca seu valor.
  route_id text,
  content_slug text,
  destination_count integer CHECK (destination_count >= 0),
  FOREIGN KEY (page_view_id,session_id) REFERENCES analytics.page_views(id,session_id) ON DELETE CASCADE
);
CREATE TABLE analytics.conversions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_token uuid NOT NULL UNIQUE, -- Token opaco; só emitido após persistência bem-sucedida no backend.
  session_id uuid NOT NULL REFERENCES analytics.sessions(id) ON DELETE CASCADE,
  form_id uuid NOT NULL REFERENCES cms.forms(id),
  consent_receipt_id uuid NOT NULL REFERENCES analytics.consent_receipts(id),
  campaign_id uuid REFERENCES cms.campaigns(id) ON DELETE SET NULL,
  source_area text NOT NULL CHECK (source_area IN ('institutional','content','landing','conversion','utility')),
  occurred_at timestamptz NOT NULL DEFAULT now()
);

-- Dados de negócio separados da telemetria; não enviar estas colunas a GA4/GTM/pixels.
CREATE TABLE crm_private.requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key uuid NOT NULL UNIQUE,
  form_id uuid NOT NULL REFERENCES cms.forms(id),
  campaign_id uuid REFERENCES cms.campaigns(id) ON DELETE SET NULL,
  source_page_id uuid REFERENCES cms.pages(id) ON DELETE SET NULL,
  name text,
  company text,
  whatsapp text,
  email text,
  customer_declaration text CHECK (customer_declaration IN ('customer','prospect','unknown')),
  operational_details jsonb NOT NULL DEFAULT '{}'::jsonb,
  contact_consent boolean, -- NULL quando não há checkbox de consentimento no formulário.
  policy_version text NOT NULL,
  status text NOT NULL DEFAULT 'received' CHECK (status IN ('received','assigned','contacted','qualified','closed','discarded')),
  received_at timestamptz NOT NULL DEFAULT now()
);
-- Canal de denúncias fica fora deste modelo comercial e fora dos públicos de mídia.
CREATE INDEX sessions_started_idx ON analytics.sessions(environment,started_at);
CREATE INDEX sessions_visitor_idx ON analytics.sessions(visitor_id,started_at);
CREATE INDEX consent_visitor_idx ON analytics.consent_receipts(visitor_id,recorded_at DESC);
CREATE INDEX page_views_session_idx ON analytics.page_views(session_id,occurred_at);
CREATE INDEX page_views_area_idx ON analytics.page_views(area,occurred_at);
CREATE INDEX events_session_idx ON analytics.events(session_id,occurred_at);
CREATE INDEX events_name_idx ON analytics.events(event_name,occurred_at);
CREATE INDEX conversions_session_idx ON analytics.conversions(session_id,occurred_at);
CREATE INDEX requests_received_idx ON crm_private.requests(received_at,status);

-- Uma linha por sessão; evita multiplicar conversões ao juntar visualizações e eventos.
CREATE VIEW analytics.v_session_summary AS
WITH views AS (
  SELECT session_id, count(*) AS page_views, sum(active_seconds) AS active_seconds,
    count(*) FILTER (WHERE page_type = 'article' AND active_seconds >= 30 AND max_scroll_percent >= 50) AS engaged_articles
  FROM analytics.page_views GROUP BY session_id
), conversions AS (
  SELECT session_id,count(*) AS conversions FROM analytics.conversions GROUP BY session_id
)
SELECT s.*,coalesce(v.page_views,0) AS page_views,coalesce(v.active_seconds,0) AS active_seconds,
  coalesce(v.engaged_articles,0) AS engaged_articles,coalesce(c.conversions,0) AS conversions,
  coalesce(c.conversions,0) > 0 AS converted
FROM analytics.sessions s LEFT JOIN views v ON v.session_id=s.id LEFT JOIN conversions c ON c.session_id=s.id;
CREATE VIEW analytics.v_daily_acquisition AS
SELECT (started_at AT TIME ZONE 'America/Sao_Paulo')::date AS day,environment,entry_area,campaign_id,
  count(*) AS sessions,count(DISTINCT visitor_id) AS browsers,
  count(*) FILTER (WHERE converted) AS converted_sessions,sum(conversions) AS conversions,
  round(100.0 * count(*) FILTER (WHERE converted) / nullif(count(*),0),2) AS session_conversion_rate
FROM analytics.v_session_summary GROUP BY 1,2,3,4;
REVOKE ALL ON ALL TABLES IN SCHEMA crm_private FROM PUBLIC;
COMMIT;
