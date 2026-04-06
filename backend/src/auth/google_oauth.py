import json
from typing import Any
from urllib.error import HTTPError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from config import (
  SSO_GOOGLE_AUTH_URL,
  SSO_GOOGLE_CLIENT_ID,
  SSO_GOOGLE_CLIENT_SECRET,
  SSO_GOOGLE_REDIRECT_URI,
  SSO_GOOGLE_SCOPE,
  SSO_GOOGLE_TOKEN_URL,
  SSO_GOOGLE_USERINFO_URL
)

from .callback_token import extract_profile_from_callback_token


class GoogleOAuthError(RuntimeError):
  pass


def ensure_google_oauth_is_configured() -> None:
  if not SSO_GOOGLE_CLIENT_ID:
    raise GoogleOAuthError("Google OAuth client id is not configured")

  if not SSO_GOOGLE_CLIENT_SECRET:
    raise GoogleOAuthError("Google OAuth client secret is not configured")


def build_google_authorize_url(*, state: str) -> str:
  ensure_google_oauth_is_configured()
  query = urlencode(
    {
      "client_id": SSO_GOOGLE_CLIENT_ID,
      "redirect_uri": SSO_GOOGLE_REDIRECT_URI,
      "response_type": "code",
      "scope": SSO_GOOGLE_SCOPE,
      "access_type": "online",
      "include_granted_scopes": "true",
      "prompt": "consent",
      "state": state
    }
  )
  return f"{SSO_GOOGLE_AUTH_URL}?{query}"


def _http_json_request(
  *,
  url: str,
  method: str = "GET",
  headers: dict[str, str] | None = None,
  data: bytes | None = None
) -> dict[str, Any]:
  request = Request(url=url, method=method, headers=headers or {}, data=data)

  try:
    with urlopen(request, timeout=15) as response:
      return json.loads(response.read().decode("utf-8"))
  except HTTPError as exc:
    try:
      response_text = exc.read().decode("utf-8")
    except Exception:
      response_text = exc.reason if hasattr(exc, "reason") else str(exc)

    raise GoogleOAuthError(f"Google OAuth HTTP error: {response_text}") from exc
  except Exception as exc:
    raise GoogleOAuthError("Google OAuth network error") from exc


def exchange_google_code_for_tokens(*, code: str) -> dict[str, Any]:
  ensure_google_oauth_is_configured()

  payload = urlencode(
    {
      "code": code,
      "client_id": SSO_GOOGLE_CLIENT_ID,
      "client_secret": SSO_GOOGLE_CLIENT_SECRET,
      "redirect_uri": SSO_GOOGLE_REDIRECT_URI,
      "grant_type": "authorization_code"
    }
  ).encode("utf-8")

  tokens = _http_json_request(
    url=SSO_GOOGLE_TOKEN_URL,
    method="POST",
    headers={"Content-Type": "application/x-www-form-urlencoded"},
    data=payload
  )

  if "error" in tokens:
    raise GoogleOAuthError(f"Google token exchange failed: {tokens.get('error')}")

  return tokens


def fetch_google_user_profile_from_tokens(tokens: dict[str, Any]) -> dict[str, Any]:
  profile: dict[str, Any] = {}

  id_token = tokens.get("id_token")
  if isinstance(id_token, str) and id_token:
    profile.update(extract_profile_from_callback_token(id_token))

  access_token = tokens.get("access_token")
  if isinstance(access_token, str) and access_token:
    userinfo = _http_json_request(
      url=SSO_GOOGLE_USERINFO_URL,
      headers={"Authorization": f"Bearer {access_token}"}
    )
    if isinstance(userinfo, dict):
      profile.update(userinfo)

  return profile
