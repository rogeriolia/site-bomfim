<?php
require_once __DIR__ . '/db.php';
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
function telemetry_reply(int $status, array $body): never { http_response_code($status); echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); exit; }
function telemetry_text($value, int $limit = 120): string { return is_scalar($value) ? mb_substr(trim((string)$value), 0, $limit) : ''; }
function allowed_landing_path($path): ?string {
    $path = parse_url((string)$path, PHP_URL_PATH) ?: '';
    $path = preg_replace('#^/site-bomfim(?=/|$)#', '', $path);
    $allowed = ['/lp/cotacao', '/lp/cotacao-completa', '/lp/embarques-frequentes', '/lp/falar-comercial'];
    return in_array($path, $allowed, true) ? $path : null;
}
function valid_session($value): ?string { return is_string($value) && preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i', $value) ? strtolower($value) : null; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') telemetry_reply(405, ['success' => false]);
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$expectedOrigin = getenv('BOMFIM_SITE_ORIGIN') ?: (((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://') . ($_SERVER['HTTP_HOST'] ?? ''));
if ($origin && !hash_equals($expectedOrigin, $origin)) telemetry_reply(403, ['success' => false]);
$raw = file_get_contents('php://input');
if (strlen($raw) > 12000) telemetry_reply(413, ['success' => false]);
$input = json_decode($raw, true);
if (!is_array($input)) telemetry_reply(400, ['success' => false]);
$path = allowed_landing_path($input['path'] ?? '');
$sessionId = valid_session($input['sessionId'] ?? null);
$types = ['page_view','heartbeat','click','pointer_move','scroll','form_start','form_step','form_submit','conversion'];
$type = telemetry_text($input['type'] ?? '', 30);
if (!$path || !$sessionId || !in_array($type, $types, true)) telemetry_reply(422, ['success' => false]);
$utm = is_array($input['utm'] ?? null) ? array_intersect_key($input['utm'], array_flip(['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','li_fat_id'])) : [];
$refHost = parse_url(telemetry_text($input['referrer'] ?? '', 500), PHP_URL_HOST) ?: null;
$payload = [];
foreach (['control','label','section','step','scrollDepth','viewportWidth','viewportHeight','screenHeight'] as $key) {
    if (array_key_exists($key, $input['payload'] ?? [])) $payload[$key] = is_numeric($input['payload'][$key]) && in_array($key, ['step','scrollDepth','viewportWidth','viewportHeight','screenHeight'], true) ? (float)$input['payload'][$key] : telemetry_text($input['payload'][$key], 100);
}
$x = is_numeric($input['x'] ?? null) ? max(0, min(1, (float)$input['x'])) : null;
$y = is_numeric($input['y'] ?? null) ? max(0, min(1, (float)$input['y'])) : null;
try {
    $db = bomfim_db();
    $db->prepare("INSERT INTO bomfim_sessions(session_id, first_path, last_path, referrer_host, utm) VALUES(:id,:path,:path,:ref,:utm) ON CONFLICT(session_id) DO UPDATE SET last_path=EXCLUDED.last_path,last_seen=NOW(),utm=CASE WHEN bomfim_sessions.utm = '{}'::jsonb THEN EXCLUDED.utm ELSE bomfim_sessions.utm END")->execute([':id'=>$sessionId,':path'=>$path,':ref'=>$refHost,':utm'=>json_encode($utm, JSON_UNESCAPED_UNICODE)]);
    $scrollDepth = isset($payload['scrollDepth']) ? max(0, min(100, (int)$payload['scrollDepth'])) : null;
    if ($scrollDepth !== null) $db->prepare('UPDATE bomfim_sessions SET max_scroll=GREATEST(max_scroll,:depth) WHERE session_id=:id')->execute([':depth'=>$scrollDepth,':id'=>$sessionId]);
    $db->prepare('INSERT INTO bomfim_events(session_id,page_path,event_type,x,y,payload) VALUES(:session,:path,:type,:x,:y,:payload)')->execute([':session'=>$sessionId,':path'=>$path,':type'=>$type,':x'=>$x,':y'=>$y,':payload'=>json_encode($payload, JSON_UNESCAPED_UNICODE)]);
    telemetry_reply(200, ['success'=>true]);
} catch (Throwable $e) { error_log('Bomfim telemetry store failed: ' . get_class($e)); telemetry_reply(503, ['success'=>false]); }
