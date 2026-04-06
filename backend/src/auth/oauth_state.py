import base64
import hashlib
import hmac
import json
import time
from typing import Any

from config import APP_AUTH_SECRET, SSO_OAUTH_STATE_TTL_SECONDS


class OAuthStateError(ValueError):
  pass


def _b64url_encode(raw_bytes: bytes) -> str:
  return base64.urlsafe_b64encode(raw_bytes).decode("utf-8").rstrip("=")


def _b64url_decode(raw_value: str) -> bytes:
  padded = f"{raw_value}{'=' * (-len(raw_value) % 4)}"
  return base64.urlsafe_b64decode(padded.encode("utf-8"))


def issue_oauth_state(*, provider: str, next_path: str | None = None) -> str:
  now = int(time.time())
  payload: dict[str, Any] = {
    "provider": provider,
    "iat": now,
    "exp": now + SSO_OAUTH_STATE_TTL_SECONDS
  }

  if next_path:
    payload["next"] = next_path

  payload_segment = _b64url_encode(json.dumps(payload, separators=(",", ":"), sort_keys=True).encode("utf-8"))
  signature = hmac.new(APP_AUTH_SECRET.encode("utf-8"), payload_segment.encode("utf-8"), hashlib.sha256).digest()
  signature_segment = _b64url_encode(signature)

  return f"{payload_segment}.{signature_segment}"


def verify_oauth_state(*, state: str, expected_provider: str) -> dict[str, Any]:
  parts = state.split(".")

  if len(parts) != 2:
    raise OAuthStateError("invalid state format")

  payload_segment, signature_segment = parts
  expected_signature = hmac.new(
    APP_AUTH_SECRET.encode("utf-8"),
    payload_segment.encode("utf-8"),
    hashlib.sha256
  ).digest()

  try:
    signature_bytes = _b64url_decode(signature_segment)
  except Exception as exc:
    raise OAuthStateError("invalid state signature") from exc

  if not hmac.compare_digest(expected_signature, signature_bytes):
    raise OAuthStateError("state signature mismatch")

  try:
    payload = json.loads(_b64url_decode(payload_segment).decode("utf-8"))
  except Exception as exc:
    raise OAuthStateError("invalid state payload") from exc

  if not isinstance(payload, dict):
    raise OAuthStateError("invalid state payload type")

  if payload.get("provider") != expected_provider:
    raise OAuthStateError("state provider mismatch")

  exp = payload.get("exp")
  if not isinstance(exp, int) or exp < int(time.time()):
    raise OAuthStateError("state expired")

  return payload
