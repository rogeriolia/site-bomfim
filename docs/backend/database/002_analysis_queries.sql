-- Consultas de referência para a equipe de backend Python.
-- A sintaxe de parâmetros deve ser adaptada ao driver/ORM escolhido. Usar parâmetros preparados :from e :to no backend
-- como limites timestamptz [início, fim), convertidos de America/Sao_Paulo.

-- 1. Aquisição por área de entrada: uma sessão pertence a uma única área.
SELECT entry_area, count(*) AS sessions, count(DISTINCT visitor_id) AS browsers,
  count(*) FILTER (WHERE converted) AS converted_sessions,
  round(100.0 * count(*) FILTER (WHERE converted) / nullif(count(*),0),2) AS conversion_rate
FROM analytics.v_session_summary
WHERE environment='production' AND started_at >= :from AND started_at < :to
GROUP BY entry_area ORDER BY sessions DESC;

-- 2. Conteúdo: contar visualizações qualificadas sem somar eventos retransmitidos.
SELECT p.content_slug, count(*) AS views,
  count(*) FILTER (WHERE p.active_seconds>=30 AND p.max_scroll_percent>=50) AS qualified_reads,
  count(*) FILTER (WHERE p.active_seconds>=60 AND p.max_scroll_percent>=90) AS completed_reads
FROM analytics.page_views p JOIN analytics.sessions s ON s.id=p.session_id
WHERE s.environment='production' AND p.page_type='article'
  AND p.occurred_at>=:from AND p.occurred_at<:to
GROUP BY p.content_slug ORDER BY qualified_reads DESC;

-- 3. Solicitações reais: relatório operacional restrito, independente do consentimento analítico.
SELECT f.conversion_type,count(*) AS received_requests
FROM crm_private.requests r JOIN cms.forms f ON f.id=r.form_id
WHERE r.received_at>=:from AND r.received_at<:to
GROUP BY f.conversion_type;
-- Nunca conceder SELECT em crm_private para a role genérica de marketing.

-- 4. Conteúdo assistido: uma conversão conta uma vez por artigo anterior na mesma sessão.
SELECT p.content_slug,count(DISTINCT c.id) AS assisted_conversions
FROM analytics.conversions c
JOIN analytics.sessions s ON s.id=c.session_id
JOIN analytics.page_views p ON p.session_id=c.session_id
WHERE s.environment='production' AND c.occurred_at>=:from AND c.occurred_at<:to
  AND p.page_type='article' AND p.active_seconds>=30 AND p.max_scroll_percent>=50
  -- O checkpoint de qualificação precisa ocorrer antes da conversão.
  AND EXISTS (SELECT 1 FROM analytics.events e WHERE e.page_view_id=p.id
    AND e.event_name='content_engaged' AND e.occurred_at<=c.occurred_at)
GROUP BY p.content_slug ORDER BY assisted_conversions DESC;

-- 5. Funil de formulários: contagem por sessão/formulário, sem fan-out.
WITH started AS (
  SELECT DISTINCT e.session_id,e.form_id FROM analytics.events e
  JOIN analytics.sessions s ON s.id=e.session_id
  WHERE s.environment='production' AND e.event_name='form_start'
    AND e.occurred_at>=:from AND e.occurred_at<:to AND e.form_id IS NOT NULL
    AND s.last_seen_at < now()-interval '30 minutes'
), results AS (
  SELECT st.*,EXISTS(SELECT 1 FROM analytics.conversions c
    WHERE c.session_id=st.session_id AND c.form_id=st.form_id) AS converted
  FROM started st
)
SELECT f.code,count(*) AS started_sessions,
  count(*) FILTER (WHERE converted) AS converted_sessions,
  count(*) FILTER (WHERE NOT converted) AS abandoned_sessions
FROM results r JOIN cms.forms f ON f.id=r.form_id GROUP BY f.code;
