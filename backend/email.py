from __future__ import annotations

import logging

import httpx

logger = logging.getLogger(__name__)

BREVO_URL = "https://api.brevo.com/v3/smtp/email"


def send_bomfim_email(
    api_key: str,
    from_email: str,
    from_name: str,
    to: str,
    to_name: str,
    subject: str,
    html: str,
) -> bool:
    payload = {
        "sender": {"name": from_name, "email": from_email},
        "to": [{"email": to, "name": to_name}],
        "subject": subject,
        "htmlContent": html,
    }
    headers = {
        "api-key": api_key,
        "Accept": "application/json",
        "Content-Type": "application/json",
    }
    try:
        with httpx.Client(timeout=15.0) as client:
            response = client.post(BREVO_URL, json=payload, headers=headers)
        if response.status_code < 200 or response.status_code >= 300:
            logger.error("Bomfim mail delivery failed; HTTP %s", response.status_code)
            return False
        return True
    except httpx.HTTPError as exc:
        logger.error("Bomfim mail delivery failed; transport error: %s", exc)
        return False