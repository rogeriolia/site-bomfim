from __future__ import annotations

import logging
import re
import secrets
import uuid
from html import escape
from typing import Any
from urllib.parse import urlparse

from email_validator import EmailNotValidError, validate_email
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

from backend.config import get_settings
from backend.db import db_connection, json_param
from backend.email import send_bomfim_email
from backend.validators import clean_value, esc, filter_utm, valid_uuid_v4, digits_only

logger = logging.getLogger(__name__)

router = APIRouter()

ALLOWED_KINDS = frozenset({"cotacao", "embarques-frequentes", "comercial"})
LABELS = {
    "cotacao": "Cotação",
    "embarques-frequentes": "Embarques frequentes",
    "comercial": "Falar com comercial",
}
ALLOWED_PATHS = [
    "/lp/cotacao",
    "/lp/cotacao-completa",
    "/lp/embarques-frequentes",
    "/lp/falar-comercial",
]


def _json(status: int, data: dict[str, Any]) -> JSONResponse:
    return JSONResponse(
        status_code=status,
        content=data,
        headers={
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff",
        },
    )


def _parse_email(email_input: str) -> str | None:
    if not email_input:
        return None
    try:
        return validate_email(email_input, check_deliverability=False).normalized
    except EmailNotValidError:
        return None


def _default_page_path(kind: str) -> str:
    if kind == "cotacao":
        return "/lp/cotacao"
    if kind == "embarques-frequentes":
        return "/lp/embarques-frequentes"
    return "/lp/falar-comercial"


def _build_email_html(
    *,
    kind: str,
    fields: dict[str, str],
    utm: dict[str, str],
    page_url: str,
    test_mode: bool,
    name: str,
    company: str,
    phone: str,
) -> tuple[str, str]:
    rows = ""
    for label, value in fields.items():
        rows += (
            f'<tr><td style="padding:11px 14px;color:#576174;font-size:14px;border-bottom:1px solid #e5e9ef;width:34%">'
            f"{esc(label)}</td><td style=\"padding:11px 14px;color:#17243a;font-size:14px;font-weight:600;"
            f'border-bottom:1px solid #e5e9ef">{escape(value).replace(chr(10), "<br>")}</td></tr>'
        )
    utm_rows = ""
    for key, value in utm.items():
        if str(value).strip():
            utm_rows += (
                f'<tr><td style="padding:7px 12px;color:#657084;font-size:12px">{esc(str(key))}</td>'
                f'<td style="padding:7px 12px;color:#17243a;font-size:12px">{esc(clean_value(value, 300))}</td></tr>'
            )
    test_tag = (
        '<div style="background:#fff3d7;color:#684a00;padding:10px 14px;font-size:13px;font-weight:700">'
        "TESTE DE FORMULÁRIO — lead de homologação</div>"
        if test_mode
        else ""
    )
    base_style = "font-family:Arial,Helvetica,sans-serif;background:#f2f4f7;margin:0;padding:28px 12px;color:#17243a"
    utm_block = (
        f'<h2 style="font-size:15px;margin:24px 0 8px">Origem da campanha</h2>'
        f'<table role="presentation" style="width:100%;background:#f7f8fa;border-collapse:collapse">{utm_rows}</table>'
        if utm_rows
        else ""
    )
    page_block = (
        f'<p style="margin:18px 0 0;font-size:12px;color:#657084">Página: {esc(page_url)}</p>'
        if page_url
        else ""
    )
    internal_html = (
        f'<div style="{base_style}"><div style="max-width:680px;margin:0 auto;background:#fff">'
        f'<div style="background:#e8002d;padding:22px 26px;color:#fff;font-size:21px;font-weight:700">'
        f'Bomfim Cargas <span style="font-size:14px;font-weight:400">· Novo lead</span></div>{test_tag}'
        f'<div style="padding:25px 26px"><h1 style="font-size:23px;line-height:1.25;margin:0 0 8px">'
        f"{esc(LABELS[kind])}</h1><p style=\"font-size:14px;line-height:1.6;color:#576174;margin:0 0 20px\">"
        f"Uma nova solicitação chegou pelo site Bomfim.</p>"
        f'<table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse">'
        f"{rows}</table>{utm_block}{page_block}</div>"
        f'<div style="background:#17243a;padding:14px 26px;color:#fff;font-size:12px">'
        f"Notificação automática de leads · Bomfim Cargas</div></div></div>"
    )
    client_html = (
        f'<div style="{base_style}"><div style="max-width:620px;margin:0 auto;background:#fff">'
        f'<div style="background:#e8002d;padding:23px 26px;color:#fff;font-size:21px;font-weight:700">'
        f"Bomfim Cargas</div><div style=\"padding:30px 26px\">"
        f'<p style="font-size:14px;color:#e8002d;font-weight:700;margin:0 0 9px">SOLICITAÇÃO RECEBIDA</p>'
        f'<h1 style="font-size:26px;line-height:1.2;margin:0 0 15px;color:#17243a">Olá, {esc(name)}.</h1>'
        f'<p style="font-size:15px;line-height:1.7;color:#465267;margin:0 0 18px">'
        f"Recebemos seu pedido sobre <strong>{esc(LABELS[kind].lower())}</strong>. "
        f"Nossa equipe vai analisar as informações e retornar pelo contato informado.</p>"
        f'<div style="background:#f4f6f8;padding:16px 18px;font-size:14px;line-height:1.6;color:#465267">'
        f'Empresa: <strong style="color:#17243a">{esc(company)}</strong><br>'
        f'WhatsApp: <strong style="color:#17243a">{esc(phone)}</strong></div>'
        f'<p style="font-size:14px;line-height:1.7;color:#465267;margin:20px 0 0">'
        f'Se precisar complementar algo, ligue para <a href="tel:08003388700" style="color:#e8002d;font-weight:700">'
        f"0800 338 8700</a>.</p></div>"
        f'<div style="background:#17243a;padding:15px 26px;color:#fff;font-size:12px">'
        f"Bomfim Cargas · Transporte e distribuição para empresas</div></div></div>"
    )
    return internal_html, client_html


@router.post("/api/leads.php")
async def post_lead(request: Request) -> JSONResponse:
    settings = get_settings()
    origin = request.headers.get("origin", "")
    allowed_origin = settings.bomfim_site_origin
    if origin and allowed_origin and not secrets.compare_digest(origin, allowed_origin):
        return _json(403, {"success": False, "message": "Origem não autorizada."})

    try:
        input_data = await request.json()
    except Exception:
        return _json(400, {"success": False, "message": "Dados inválidos."})
    if not isinstance(input_data, dict):
        return _json(400, {"success": False, "message": "Dados inválidos."})

    kind = clean_value(input_data.get("kind"), 40)
    if kind not in ALLOWED_KINDS:
        return _json(422, {"success": False, "message": "Tipo de solicitação inválido."})

    name = clean_value(input_data.get("name"), 120)
    company = clean_value(input_data.get("company"), 160)
    email_input = clean_value(input_data.get("email"), 190)
    email = _parse_email(email_input)
    phone = clean_value(input_data.get("phone"), 40)
    if not name or not company or not phone or (email_input and not email):
        return _json(
            422,
            {"success": False, "message": "Preencha nome, empresa e WhatsApp corretamente."},
        )

    fields = {
        "Nome": name,
        "Empresa": company,
        "E-mail": email or "",
        "WhatsApp": phone,
        "Origem": clean_value(input_data.get("origin")),
        "CEP de origem": clean_value(input_data.get("originCep"), 20),
        "Destino principal": clean_value(input_data.get("destination")),
        "CEP de destino": clean_value(input_data.get("destinationCep"), 20),
        "Perfil da carga": clean_value(input_data.get("segment")),
        "Frequência": clean_value(input_data.get("frequency")),
        "Volume médio": clean_value(input_data.get("volume")),
        "Detalhes da solicitação": clean_value(
            input_data.get("message") or input_data.get("need"), 6000
        ),
    }
    fields = {k: v for k, v in fields.items() if v}

    test_mode = bool(input_data.get("testMode"))
    page_url = clean_value(input_data.get("pageUrl"), 1000)
    utm = filter_utm(input_data.get("utm"))
    session_id = valid_uuid_v4(input_data.get("sessionId"))
    request_id = valid_uuid_v4(input_data.get("requestId")) or str(uuid.uuid4())

    page_path = urlparse(page_url).path or _default_page_path(kind)
    page_path = re.sub(r"^/site-bomfim(?=/|$)", "", page_path)
    if page_path not in ALLOWED_PATHS:
        page_path = _default_page_path(kind)

    origin_field = clean_value(input_data.get("origin"), 180)
    origin_cep = digits_only(clean_value(input_data.get("originCep"), 20))
    destination = clean_value(input_data.get("destination"), 180)
    destination_cep = digits_only(clean_value(input_data.get("destinationCep"), 20))
    details = {
        k: v
        for k, v in {
            "segment": clean_value(input_data.get("segment"), 120),
            "frequency": clean_value(input_data.get("frequency"), 120),
            "volume": clean_value(input_data.get("volume"), 180),
            "message": clean_value(input_data.get("message") or input_data.get("need"), 3000),
        }.items()
        if v
    }

    internal_html, client_html = _build_email_html(
        kind=kind,
        fields=fields,
        utm=utm,
        page_url=page_url,
        test_mode=test_mode,
        name=name,
        company=company,
        phone=phone,
    )

    try:
        with db_connection() as conn:
            with conn.cursor() as cur:
                if session_id:
                    cur.execute(
                        """
                        INSERT INTO bomfim_sessions(session_id, first_path, last_path, utm)
                        VALUES (%s, %s, %s, %s::jsonb)
                        ON CONFLICT(session_id) DO UPDATE SET
                            last_path = EXCLUDED.last_path,
                            last_seen = NOW()
                        """,
                        (session_id, page_path, page_path, json_param(utm)),
                    )
                    cur.execute(
                        """
                        INSERT INTO bomfim_events(session_id, page_path, event_type, payload)
                        VALUES (%s, %s, 'conversion', %s::jsonb)
                        ON CONFLICT DO NOTHING
                        """,
                        (session_id, page_path, json_param({"requestId": request_id})),
                    )
                cur.execute(
                    """
                    INSERT INTO bomfim_leads(
                        request_id, session_id, page_path, kind, name, company, phone, email,
                        origin, origin_cep, destination, destination_cep, test_mode, details, utm
                    ) VALUES (
                        %s, %s, %s, %s, %s, %s, %s, %s,
                        %s, %s, %s, %s, %s, %s::jsonb, %s::jsonb
                    )
                    ON CONFLICT(request_id) DO UPDATE SET request_id = EXCLUDED.request_id
                    RETURNING id, notification_status, client_receipt_status
                    """,
                    (
                        request_id,
                        session_id,
                        page_path,
                        kind,
                        name,
                        company,
                        phone,
                        email,
                        origin_field or None,
                        origin_cep if len(origin_cep) == 8 else None,
                        destination or None,
                        destination_cep if len(destination_cep) == 8 else None,
                        test_mode,
                        json_param(details),
                        json_param(utm),
                    ),
                )
                lead = cur.fetchone()
            conn.commit()
        lead_id = int(lead["id"])
    except Exception as exc:
        logger.exception("Bomfim lead persistence failed: %s", type(exc).__name__)
        return _json(
            503,
            {
                "success": False,
                "message": "Não foi possível registrar sua solicitação agora. Tente novamente ou ligue para 0800 338 8700.",
            },
        )

    api_key = settings.bomfim_brevo_api_key
    from_email = settings.bomfim_from_email
    from_name = settings.bomfim_from_name
    notify_email = settings.bomfim_leads_email
    test_email = settings.bomfim_test_email

    destination_client = test_email if test_mode else (email or "")
    notify_subject = (
        f"{'[TESTE] ' if test_mode else ''}Novo lead Bomfim · {LABELS[kind]} · {company}"
    )
    client_subject = (
        "[TESTE] Confirmação de solicitação Bomfim"
        if test_mode
        else "Recebemos sua solicitação · Bomfim Cargas"
    )
    has_mail_config = bool(api_key) and bool(from_email)
    already_notified = lead["notification_status"] == "sent"
    internal_ok = already_notified or (
        has_mail_config
        and send_bomfim_email(
            api_key,
            from_email,
            from_name,
            notify_email,
            "Comercial Bomfim",
            notify_subject,
            internal_html,
        )
    )
    client_skipped = not test_mode and not email
    client_already_sent = lead["client_receipt_status"] == "sent"
    client_ok = (
        client_skipped
        or client_already_sent
        or (
            internal_ok
            and has_mail_config
            and destination_client
            and send_bomfim_email(
                api_key,
                from_email,
                from_name,
                destination_client,
                name,
                client_subject,
                client_html,
            )
        )
    )
    notify_status = "sent" if internal_ok else ("failed" if has_mail_config else "pending")
    client_status = (
        "skipped"
        if client_skipped
        else ("sent" if client_ok else ("failed" if has_mail_config else "pending"))
    )

    try:
        with db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    UPDATE bomfim_leads
                    SET notification_status = %s, client_receipt_status = %s
                    WHERE id = %s
                    """,
                    (notify_status, client_status, lead_id),
                )
            conn.commit()
    except Exception as exc:
        logger.error("Bomfim lead notification status update failed: %s", type(exc).__name__)

    if not internal_ok or not client_ok:
        logger.warning(
            "Bomfim lead stored; email notification remains %s; client receipt %s.",
            notify_status,
            client_status,
        )

    return _json(
        200,
        {
            "success": True,
            "leadId": lead_id,
            "notificationPending": not internal_ok,
            "clientReceiptPending": not client_ok,
        },
    )