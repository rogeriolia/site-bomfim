<?php
/** Bomfim lead capture endpoint. Credentials are supplied only through environment variables. */
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
require_once __DIR__ . '/db.php';

function respond(int $status, array $data): never {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
function clean_value($value, int $limit = 500): string {
    if (!is_scalar($value)) return '';
    return function_exists('mb_substr') ? mb_substr(trim((string)$value), 0, $limit) : substr(trim((string)$value), 0, $limit);
}
function esc(string $value): string { return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function send_bomfim_email(string $apiKey, string $fromEmail, string $fromName, string $to, string $toName, string $subject, string $html): bool {
    $payload = [
        'sender' => ['name' => $fromName, 'email' => $fromEmail],
        'to' => [['email' => $to, 'name' => $toName]],
        'subject' => $subject,
        'htmlContent' => $html,
    ];
    $curl = curl_init('https://api.brevo.com/v3/smtp/email');
    curl_setopt_array($curl, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        CURLOPT_HTTPHEADER => ['api-key: ' . $apiKey, 'Accept: application/json', 'Content-Type: application/json'],
        CURLOPT_TIMEOUT => 15,
    ]);
    curl_exec($curl);
    $status = (int)curl_getinfo($curl, CURLINFO_HTTP_CODE);
    $error = curl_error($curl);
    curl_close($curl);
    if ($error || $status < 200 || $status >= 300) error_log('Bomfim mail delivery failed; HTTP ' . $status . ($error ? '; transport error' : ''));
    return !$error && $status >= 200 && $status < 300;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(405, ['success' => false, 'message' => 'Método não permitido.']);
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigin = getenv('BOMFIM_SITE_ORIGIN') ?: '';
if ($origin && $allowedOrigin && !hash_equals($allowedOrigin, $origin)) respond(403, ['success' => false, 'message' => 'Origem não autorizada.']);
$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) respond(400, ['success' => false, 'message' => 'Dados inválidos.']);

$allowedKinds = ['cotacao', 'embarques-frequentes', 'comercial'];
$kind = clean_value($input['kind'] ?? '', 40);
if (!in_array($kind, $allowedKinds, true)) respond(422, ['success' => false, 'message' => 'Tipo de solicitação inválido.']);
$name = clean_value($input['name'] ?? '', 120);
$company = clean_value($input['company'] ?? '', 160);
$emailInput = clean_value($input['email'] ?? '', 190);
$email = $emailInput === '' ? null : filter_var($emailInput, FILTER_VALIDATE_EMAIL);
$phone = clean_value($input['phone'] ?? '', 40);
if (!$name || !$company || !$phone || ($emailInput !== '' && !$email)) respond(422, ['success' => false, 'message' => 'Preencha nome, empresa e WhatsApp corretamente.']);

$labels = ['cotacao' => 'Cotação', 'embarques-frequentes' => 'Embarques frequentes', 'comercial' => 'Falar com comercial'];
$fields = [
    'Nome' => $name,
    'Empresa' => $company,
    'E-mail' => $email ?: '',
    'WhatsApp' => $phone,
    'Origem' => clean_value($input['origin'] ?? ''),
    'CEP de origem' => clean_value($input['originCep'] ?? '', 20),
    'Destino principal' => clean_value($input['destination'] ?? ''),
    'CEP de destino' => clean_value($input['destinationCep'] ?? '', 20),
    'Perfil da carga' => clean_value($input['segment'] ?? ''),
    'Frequência' => clean_value($input['frequency'] ?? ''),
    'Volume médio' => clean_value($input['volume'] ?? ''),
    'Detalhes da solicitação' => clean_value($input['message'] ?? $input['need'] ?? '', 6000),
];
$fields = array_filter($fields, static fn($value) => $value !== '');
$testMode = !empty($input['testMode']);
$pageUrl = clean_value($input['pageUrl'] ?? '', 1000);
$utm = is_array($input['utm'] ?? null) ? array_intersect_key($input['utm'], array_flip(['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','li_fat_id'])) : [];
$sessionId = preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i', (string)($input['sessionId'] ?? '')) ? strtolower((string)$input['sessionId']) : null;
$requestId = preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i', (string)($input['requestId'] ?? '')) ? strtolower((string)$input['requestId']) : sprintf('%04x%04x-%04x-4%03x-%04x-%04x%04x%04x', random_int(0,65535),random_int(0,65535),random_int(0,65535),random_int(0,4095),random_int(0,16383)|0x8000,random_int(0,65535),random_int(0,65535),random_int(0,65535));
$pagePath = parse_url($pageUrl, PHP_URL_PATH) ?: '/lp/' . ($kind === 'cotacao' ? 'cotacao' : ($kind === 'embarques-frequentes' ? 'embarques-frequentes' : 'falar-comercial'));
$pagePath = preg_replace('#^/site-bomfim(?=/|$)#', '', $pagePath);
$allowedPaths = ['/lp/cotacao','/lp/cotacao-completa','/lp/embarques-frequentes','/lp/falar-comercial'];
if (!in_array($pagePath, $allowedPaths, true)) $pagePath = '/lp/' . ($kind === 'cotacao' ? 'cotacao' : ($kind === 'embarques-frequentes' ? 'embarques-frequentes' : 'falar-comercial'));
$origin = clean_value($input['origin'] ?? '', 180);
$originCep = preg_replace('/\D/', '', clean_value($input['originCep'] ?? '', 20));
$destination = clean_value($input['destination'] ?? '', 180);
$destinationCep = preg_replace('/\D/', '', clean_value($input['destinationCep'] ?? '', 20));
$details = array_filter([
    'segment' => clean_value($input['segment'] ?? '', 120),
    'frequency' => clean_value($input['frequency'] ?? '', 120),
    'volume' => clean_value($input['volume'] ?? '', 180),
    'message' => clean_value($input['message'] ?? $input['need'] ?? '', 3000),
], static fn($value) => $value !== '');


$apiKey = getenv('BOMFIM_BREVO_API_KEY') ?: '';
$fromEmail = getenv('BOMFIM_FROM_EMAIL') ?: '';
$fromName = getenv('BOMFIM_FROM_NAME') ?: 'Bomfim Cargas';
$notifyEmail = getenv('BOMFIM_LEADS_EMAIL') ?: 'apolo@4lia.com.br';
$testEmail = getenv('BOMFIM_TEST_EMAIL') ?: 'apolo+cliente@4lia.com.br';

$rows = '';
foreach ($fields as $label => $value) $rows .= '<tr><td style="padding:11px 14px;color:#576174;font-size:14px;border-bottom:1px solid #e5e9ef;width:34%">'.esc($label).'</td><td style="padding:11px 14px;color:#17243a;font-size:14px;font-weight:600;border-bottom:1px solid #e5e9ef">'.nl2br(esc($value)).'</td></tr>';
$utmRows = '';
foreach ($utm as $key => $value) if (is_scalar($value) && trim((string)$value) !== '') $utmRows .= '<tr><td style="padding:7px 12px;color:#657084;font-size:12px">'.esc((string)$key).'</td><td style="padding:7px 12px;color:#17243a;font-size:12px">'.esc(clean_value($value, 300)).'</td></tr>';
$testTag = $testMode ? '<div style="background:#fff3d7;color:#684a00;padding:10px 14px;font-size:13px;font-weight:700">TESTE DE FORMULÁRIO — lead de homologação</div>' : '';
$baseStyle = 'font-family:Arial,Helvetica,sans-serif;background:#f2f4f7;margin:0;padding:28px 12px;color:#17243a';
$internalHtml = '<div style="'.$baseStyle.'"><div style="max-width:680px;margin:0 auto;background:#fff"><div style="background:#e8002d;padding:22px 26px;color:#fff;font-size:21px;font-weight:700">Bomfim Cargas <span style="font-size:14px;font-weight:400">· Novo lead</span></div>'.$testTag.'<div style="padding:25px 26px"><h1 style="font-size:23px;line-height:1.25;margin:0 0 8px">'.esc($labels[$kind]).'</h1><p style="font-size:14px;line-height:1.6;color:#576174;margin:0 0 20px">Uma nova solicitação chegou pelo site Bomfim.</p><table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse">'.$rows.'</table>'.($utmRows ? '<h2 style="font-size:15px;margin:24px 0 8px">Origem da campanha</h2><table role="presentation" style="width:100%;background:#f7f8fa;border-collapse:collapse">'.$utmRows.'</table>' : '').($pageUrl ? '<p style="margin:18px 0 0;font-size:12px;color:#657084">Página: '.esc($pageUrl).'</p>' : '').'</div><div style="background:#17243a;padding:14px 26px;color:#fff;font-size:12px">Notificação automática de leads · Bomfim Cargas</div></div></div>';
$clientHtml = '<div style="'.$baseStyle.'"><div style="max-width:620px;margin:0 auto;background:#fff"><div style="background:#e8002d;padding:23px 26px;color:#fff;font-size:21px;font-weight:700">Bomfim Cargas</div><div style="padding:30px 26px"><p style="font-size:14px;color:#e8002d;font-weight:700;margin:0 0 9px">SOLICITAÇÃO RECEBIDA</p><h1 style="font-size:26px;line-height:1.2;margin:0 0 15px;color:#17243a">Olá, '.esc($name).'.</h1><p style="font-size:15px;line-height:1.7;color:#465267;margin:0 0 18px">Recebemos seu pedido sobre <strong>'.esc(strtolower($labels[$kind])).'</strong>. Nossa equipe vai analisar as informações e retornar pelo contato informado.</p><div style="background:#f4f6f8;padding:16px 18px;font-size:14px;line-height:1.6;color:#465267">Empresa: <strong style="color:#17243a">'.esc($company).'</strong><br>WhatsApp: <strong style="color:#17243a">'.esc($phone).'</strong></div><p style="font-size:14px;line-height:1.7;color:#465267;margin:20px 0 0">Se precisar complementar algo, ligue para <a href="tel:08003388700" style="color:#e8002d;font-weight:700">0800 338 8700</a>.</p></div><div style="background:#17243a;padding:15px 26px;color:#fff;font-size:12px">Bomfim Cargas · Transporte e distribuição para empresas</div></div></div>';

try {
    $db = bomfim_db();
    if ($sessionId) {
        $db->prepare("INSERT INTO bomfim_sessions(session_id,first_path,last_path,utm) VALUES(:id,:path,:path,:utm) ON CONFLICT(session_id) DO UPDATE SET last_path=EXCLUDED.last_path,last_seen=NOW()")
            ->execute([':id'=>$sessionId,':path'=>$pagePath,':utm'=>json_encode($utm, JSON_UNESCAPED_UNICODE)]);
        $db->prepare("INSERT INTO bomfim_events(session_id,page_path,event_type,payload) VALUES(:id,:path,'conversion',CAST(:payload AS jsonb)) ON CONFLICT DO NOTHING")->execute([':id'=>$sessionId,':path'=>$pagePath,':payload'=>json_encode(['requestId'=>$requestId])]);
    }
    $insert = $db->prepare("INSERT INTO bomfim_leads(request_id,session_id,page_path,kind,name,company,phone,email,origin,origin_cep,destination,destination_cep,test_mode,details,utm) VALUES(:request,:session,:path,:kind,:name,:company,:phone,:email,:origin,:origin_cep,:destination,:destination_cep,:test,:details,:utm) ON CONFLICT(request_id) DO UPDATE SET request_id=EXCLUDED.request_id RETURNING id,notification_status,client_receipt_status");
    $insert->execute([':request'=>$requestId,':session'=>$sessionId,':path'=>$pagePath,':kind'=>$kind,':name'=>$name,':company'=>$company,':phone'=>$phone,':email'=>$email,':origin'=>$origin ?: null,':origin_cep'=>strlen($originCep)===8?$originCep:null,':destination'=>$destination ?: null,':destination_cep'=>strlen($destinationCep)===8?$destinationCep:null,':test'=>$testMode,':details'=>json_encode($details,JSON_UNESCAPED_UNICODE),':utm'=>json_encode($utm,JSON_UNESCAPED_UNICODE)]);
    $lead = $insert->fetch();
    $leadId = (int)$lead['id'];
} catch (Throwable $e) {
    error_log('Bomfim lead persistence failed: ' . get_class($e));
    respond(503, ['success'=>false,'message'=>'Não foi possível registrar sua solicitação agora. Tente novamente ou ligue para 0800 338 8700.']);
}

$destinationClient = $testMode ? $testEmail : $email;
$notifySubject = ($testMode ? '[TESTE] ' : '') . 'Novo lead Bomfim · ' . $labels[$kind] . ' · ' . $company;
$clientSubject = $testMode ? '[TESTE] Confirmação de solicitação Bomfim' : 'Recebemos sua solicitação · Bomfim Cargas';
$hasMailConfig = (bool)$apiKey && (bool)$fromEmail;
$alreadyNotified = $lead['notification_status'] === 'sent';
$internalOk = $alreadyNotified || ($hasMailConfig && send_bomfim_email($apiKey, $fromEmail, $fromName, $notifyEmail, 'Comercial Bomfim', $notifySubject, $internalHtml));
$clientSkipped = !$testMode && !$email;
$clientAlreadySent = $lead['client_receipt_status'] === 'sent';
$clientOk = $clientSkipped || $clientAlreadySent || ($internalOk && $hasMailConfig && send_bomfim_email($apiKey, $fromEmail, $fromName, $destinationClient, $name, $clientSubject, $clientHtml));
$notifyStatus = $internalOk ? 'sent' : ($hasMailConfig ? 'failed' : 'pending');
$clientStatus = $clientSkipped ? 'skipped' : ($clientOk ? 'sent' : ($hasMailConfig ? 'failed' : 'pending'));
try { $db->prepare('UPDATE bomfim_leads SET notification_status=:notify,client_receipt_status=:client WHERE id=:id')->execute([':notify'=>$notifyStatus,':client'=>$clientStatus,':id'=>$leadId]); }
catch (Throwable $e) { error_log('Bomfim lead notification status update failed: ' . get_class($e)); }
if (!$internalOk || !$clientOk) error_log('Bomfim lead stored; email notification remains ' . $notifyStatus . '; client receipt ' . $clientStatus . '.');
respond(200, ['success'=>true,'leadId'=>$leadId,'notificationPending'=>!$internalOk,'clientReceiptPending'=>!$clientOk]);
