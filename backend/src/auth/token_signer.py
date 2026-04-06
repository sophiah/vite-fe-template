import base64
import hashlib
import hmac
import json
import time
from typing import Any

from config import APP_AUTH_SECRET, AUTH_TOKEN_TTL_SECONDS, REFRESH_TOKEN_TTL_SECONDS


def _b64url_encode(raw_bytes: bytes) -> str:
  return base64.urlsafe_b64encode(raw_bytes).decode("utf-8").rstrip("=")


def _b64url_decode(raw_value: str) -> bytes:
  padded = f"{raw_value}{'=' * (-len(raw_value) % 4)}"
  return base64.urlsafe_b64decode(padded.encode("utf-8"))


def _json_to_segment(payload: dict[str, Any]) -> str:
  raw_json = json.dumps(payload, separators=(",", ":"), sort_keys=True).encode("utf-8")
  return _b64url_encode(raw_json)


def issue_self_signed_token(
  *,
  email: str,
  provider: str,
  provider_subject: str,
  display_name: str | None = None,
  avatar_url: str | None = None,
  token_type: str = "access",
  ttl_seconds: int | None = None
) -> str:
  now = int(time.time())
  token_ttl = ttl_seconds if isinstance(ttl_seconds, int) and ttl_seconds > 0 else AUTH_TOKEN_TTL_SECONDS

  header_segment = _json_to_segment({"alg": "HS256", "typ": "JWT"})
  payload = {
    "iss": "backend-self-signed",
    "sub": email,
    "email": email,
    "provider": provider,
    "provider_subject": provider_subject,
    "token_type": token_type,
    "iat": now,
    "exp": now + token_ttl
  }
  if display_name:
    payload["display_name"] = display_name
  if avatar_url:
    payload["avatar_url"] = avatar_url

  payload_segment = _json_to_segment(payload)

  signing_input = f"{header_segment}.{payload_segment}".encode("utf-8")
  signature = hmac.new(APP_AUTH_SECRET.encode("utf-8"), signing_input, hashlib.sha256).digest()
  signature_segment = _b64url_encode(signature)

  return f"{header_segment}.{payload_segment}.{signature_segment}"


def issue_refresh_token(
  *,
  email: str,
  provider: str,
  provider_subject: str,
  display_name: str | None = None,
  avatar_url: str | None = None
) -> str:
  return issue_self_signed_token(
    email=email,
    provider=provider,
    provider_subject=provider_subject,
    display_name=display_name,
    avatar_url=avatar_url,
    token_type="refresh",
    ttl_seconds=REFRESH_TOKEN_TTL_SECONDS
  )


def verify_self_signed_token(token: str, expected_token_type: str | None = None) -> dict[str, Any] | None:
  parts = token.split(".")

  if len(parts) != 3:
    return None

  header_segment, payload_segment, signature_segment = parts
  signing_input = f"{header_segment}.{payload_segment}".encode("utf-8")
  expected_signature = hmac.new(APP_AUTH_SECRET.encode("utf-8"), signing_input, hashlib.sha256).digest()

  try:
    signature = _b64url_decode(signature_segment)
  except Exception:
    return None

  if not hmac.compare_digest(expected_signature, signature):
    return None

  try:
    payload = json.loads(_b64url_decode(payload_segment).decode("utf-8"))
  except Exception:
    return None

  if not isinstance(payload, dict):
    return None

  exp = payload.get("exp")
  if not isinstance(exp, int) or exp < int(time.time()):
    return None

  if expected_token_type:
    token_type = payload.get("token_type")
    if token_type != expected_token_type:
      return None

  return payload
