import base64
import json
from typing import Any


def _decode_base64url_json(raw_value: str) -> dict[str, Any]:
  padded = f"{raw_value}{'=' * (-len(raw_value) % 4)}"
  decoded = base64.urlsafe_b64decode(padded.encode("utf-8"))
  parsed = json.loads(decoded.decode("utf-8"))

  if not isinstance(parsed, dict):
    return {}

  return parsed


def extract_profile_from_callback_token(callback_token: str) -> dict[str, Any]:
  token = callback_token.strip().removeprefix("Bearer ").strip()

  if not token:
    return {}

  token_parts = token.split(".")

  if len(token_parts) >= 2:
    try:
      return _decode_base64url_json(token_parts[1])
    except Exception:
      return {}

  try:
    parsed = json.loads(token)
    return parsed if isinstance(parsed, dict) else {}
  except Exception:
    return {}
