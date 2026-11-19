<?php
require_once __DIR__ . '/db.php';
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
function coverage_reply(int $status, array $body): never { http_response_code($status); echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); exit; }
function coverage_path($path): ?string { $path = parse_url((string)$path, PHP_URL_PATH) ?: ''; $path = preg_replace('#^/site-bomfim(?=/|$)#', '', $path); return in_array($path, ['/lp/cotacao','/lp/cotacao-completa','/lp/embarques-frequentes','/lp/falar-comercial'], true) ? $path : null; }
function coverage_session($value): ?string { return is_string($value) && preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i', $value) ? strtolower($value) : null; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') coverage_reply(405, ['success'=>false]);
$origin = $_SERVER['HTTP_ORIGIN'] ?? ''; $expected = getenv('BOMFIM_SITE_ORIGIN') ?: (((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://') . ($_SERVER['HTTP_HOST'] ?? ''));
if ($origin && !hash_equals($expected, $origin)) coverage_reply(403, ['success'=>false]);
$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) coverage_reply(400, ['success'=>false]);
$path = coverage_path($input['path'] ?? ''); $sessionId = coverage_session($input['sessionId'] ?? null);
$cep = preg_replace('/\D/', '', (string)($input['cep'] ?? '')); $city = mb_substr(trim((string)($input['city'] ?? '')), 0, 100); $uf = strtoupper(mb_substr(trim((string)($input['uf'] ?? '')), 0, 2));
if (!$path || (!$sessionId && !empty($input['sessionId'])) || (strlen($cep) !== 8 && (!$city || !preg_match('/^[A-Z]{2}$/', $uf)))) coverage_reply(422, ['success'=>false]);
$queryType = strlen($cep) === 8 ? 'cep' : 'city'; $queryValue = $queryType === 'cep' ? $cep : $city;
try {
  $db = bomfim_db();
  if ($queryType === 'cep') {
    $stmt = $db->prepare("SELECT city,uf,unit_code,availability FROM bomfim_coverage_base WHERE :cep BETWEEN cep_from AND cep_to ORDER BY availability='standard' DESC LIMIT 20");
    $stmt->execute([':cep'=>$cep]);
  } else {
    $stmt = $db->prepare("SELECT city,uf,unit_code,availability FROM bomfim_coverage_base WHERE uf=:uf AND lower(unaccent(city))=lower(unaccent(:city)) ORDER BY availability='standard' DESC LIMIT 20");
    $stmt->execute([':uf'=>$uf,':city'=>$city]);
  }
  $rows = $stmt->fetchAll();
  $status = !$rows ? 'not_covered' : (array_filter($rows, static fn($row)=>$row['availability']==='standard') ? 'covered' : 'conditional');
  $resolvedCity = $rows[0]['city'] ?? $city; $resolvedUf = $rows[0]['uf'] ?? ($uf ?: null); $unitCodes = array_values(array_unique(array_column($rows,'unit_code')));
  $db->prepare('INSERT INTO bomfim_coverage_checks(session_id,page_path,query_type,query_value,uf,coverage_status,unit_codes) VALUES(:session,:path,:type,:value,:uf,:status,:units)')->execute([':session'=>$sessionId,':path'=>$path,':type'=>$queryType,':value'=>$queryValue,':uf'=>$resolvedUf,':status'=>$status,':units'=>json_encode($unitCodes)]);
  coverage_reply(200, ['success'=>true,'status'=>$status,'city'=>$resolvedCity,'uf'=>$resolvedUf,'units'=>$unitCodes]);
} catch (Throwable $e) { error_log('Bomfim coverage check failed: '.get_class($e)); coverage_reply(503, ['success'=>false,'message'=>'Não foi possível consultar a cobertura agora.']); }
