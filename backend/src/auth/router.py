from urllib.parse import urlsplit, urlunsplit

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse, RedirectResponse

from auth.callback_token import extract_profile_from_callback_token
from auth.google_oauth import (
  GoogleOAuthError,
  build_google_authorize_url,
  exchange_google_code_for_tokens,
  fetch_google_user_profile_from_tokens
)
from auth.oauth_state import OAuthStateError, issue_oauth_state, verify_oauth_state
from auth.repository import upsert_user_with_identity
from auth.schemas import SsoTokenIssueRequest
from auth.token_signer import issue_refresh_token, issue_self_signed_token, verify_self_signed_token
from config import (
  AUTH_COOKIE_NAME,
  AUTH_TOKEN_TTL_SECONDS,
  COOKIE_DOMAIN,
  COOKIE_SAMESITE,
  COOKIE_SECURE,
  FRONTEND_AUTH_ERROR_URL,
  FRONTEND_AUTH_SUCCESS_URL,
  REFRESH_COOKIE_NAME,
  REFRESH_TOKEN_TTL_SECONDS
)
from database import DatabaseConfigurationError

router = APIRouter()


def _normalize_email(email: str | None) -> str:
  if not email:
    return ""

  return email.strip().lower()


def _cookie_domain_from_request(payload: SsoTokenIssueRequest) -> str | None:
  if payload.cookie_domain:
    return payload.cookie_domain.strip() or None

  if COOKIE_DOMAIN:
    return COOKIE_DOMAIN.strip() or None

  return None


def _normalize_next_path(next_path: str | None) -> str | None:
  if not next_path:
    return None

  candidate = next_path.strip()
  if not candidate:
    return None

  if not candidate.startswith("/") or candidate.startswith("//"):
    return None

  return candidate


def _build_success_redirect_url(next_path: str | None) -> str:
  normalized_next = _normalize_next_path(next_path)
  if not normalized_next:
    return FRONTEND_AUTH_SUCCESS_URL

  parsed = urlsplit(FRONTEND_AUTH_SUCCESS_URL)
  return urlunsplit((parsed.scheme, parsed.netloc, normalized_next, "", ""))


def _set_auth_cookies(
  response: JSONResponse | RedirectResponse,
  *,
  email: str,
  provider: str,
  provider_subject: str,
  display_name: str | None,
  avatar_url: str | None,
  cookie_domain: str | None
) -> None:
  access_token = issue_self_signed_token(
    email=email,
    provider=provider,
    provider_subject=provider_subject,
    display_name=display_name,
    avatar_url=avatar_url
  )
  refresh_token = issue_refresh_token(
    email=email,
    provider=provider,
    provider_subject=provider_subject,
    display_name=display_name,
    avatar_url=avatar_url
  )

  response.set_cookie(
    key=AUTH_COOKIE_NAME,
    value=access_token,
    max_age=AUTH_TOKEN_TTL_SECONDS,
    httponly=True,
    secure=COOKIE_SECURE,
    samesite=COOKIE_SAMESITE,
    domain=cookie_domain,
    path="/"
  )
  response.set_cookie(
    key=REFRESH_COOKIE_NAME,
    value=refresh_token,
    max_age=REFRESH_TOKEN_TTL_SECONDS,
    httponly=True,
    secure=COOKIE_SECURE,
    samesite=COOKIE_SAMESITE,
    domain=cookie_domain,
    path="/"
  )


def _clear_auth_cookies(response: JSONResponse | RedirectResponse, cookie_domain: str | None) -> None:
  for cookie_name in (AUTH_COOKIE_NAME, REFRESH_COOKIE_NAME):
    response.delete_cookie(
      key=cookie_name,
      domain=cookie_domain,
      path="/",
      secure=COOKIE_SECURE,
      samesite=COOKIE_SAMESITE,
      httponly=True
    )


def _default_cookie_domain() -> str | None:
  return COOKIE_DOMAIN.strip() if COOKIE_DOMAIN else None


def _process_sso_callback(
  *,
  provider: str,
  callback_token: str
) -> tuple[str, str, str | None, str | None]:
  profile = extract_profile_from_callback_token(callback_token)
  return _process_sso_profile(provider=provider, profile=profile)


def _process_sso_profile(
  *,
  provider: str,
  profile: dict
) -> tuple[str, str, str | None, str | None]:
  provider_name = provider.strip().lower()
  email = _normalize_email(profile.get("email"))

  if not email:
    raise HTTPException(status_code=400, detail="email claim is missing in callback token")

  provider_subject = str(profile.get("sub") or email)
  display_name = str(profile.get("name")) if profile.get("name") else None
  avatar_url = str(profile.get("picture")) if profile.get("picture") else None
  provider_email = _normalize_email(profile.get("email")) or None

  try:
    upsert_user_with_identity(
      email=email,
      provider=provider_name,
      provider_subject=provider_subject,
      display_name=display_name,
      avatar_url=avatar_url,
      provider_email=provider_email,
      profile=profile
    )
  except DatabaseConfigurationError as exc:
    raise HTTPException(status_code=500, detail=str(exc)) from exc
  except Exception:
    raise HTTPException(status_code=500, detail="failed to persist sso user")

  return email, provider_subject, display_name, avatar_url


def _build_session_payload(payload: dict) -> dict:
  user = {
    "email": payload.get("email"),
    "provider": payload.get("provider"),
    "displayName": payload.get("display_name"),
    "avatarUrl": payload.get("avatar_url")
  }

  return {
    "loggedIn": True,
    "email": user["email"],
    "provider": user["provider"],
    "user": user
  }


@router.get("/session")
def get_auth_session(request: Request) -> dict:
  raw_token = request.cookies.get(AUTH_COOKIE_NAME)
  raw_refresh_token = request.cookies.get(REFRESH_COOKIE_NAME)

  if not raw_token:
    return {"loggedIn": False, "canRefresh": bool(raw_refresh_token)}

  payload = verify_self_signed_token(raw_token, expected_token_type="access")
  if not payload:
    return {"loggedIn": False, "canRefresh": bool(raw_refresh_token)}

  return _build_session_payload(payload)


@router.post("/refresh")
def refresh_auth_session(request: Request) -> JSONResponse:
  raw_token = request.cookies.get(REFRESH_COOKIE_NAME)
  if not raw_token:
    return JSONResponse({"loggedIn": False}, status_code=401)

  payload = verify_self_signed_token(raw_token, expected_token_type="refresh")
  if not payload:
    response = JSONResponse({"loggedIn": False}, status_code=401)
    _clear_auth_cookies(response, _default_cookie_domain())
    return response

  email = _normalize_email(payload.get("email"))
  provider = str(payload.get("provider") or "")
  provider_subject = str(payload.get("provider_subject") or email)
  if not email or not provider:
    response = JSONResponse({"loggedIn": False}, status_code=401)
    _clear_auth_cookies(response, _default_cookie_domain())
    return response

  display_name = str(payload.get("display_name")) if payload.get("display_name") else None
  avatar_url = str(payload.get("avatar_url")) if payload.get("avatar_url") else None

  response_payload = _build_session_payload(
    {
      "email": email,
      "provider": provider,
      "display_name": display_name,
      "avatar_url": avatar_url
    }
  )
  response = JSONResponse(response_payload)
  _set_auth_cookies(
    response,
    email=email,
    provider=provider,
    provider_subject=provider_subject,
    display_name=display_name,
    avatar_url=avatar_url,
    cookie_domain=_default_cookie_domain()
  )
  return response


@router.post("/logout")
def logout() -> JSONResponse:
  response = JSONResponse({"ok": True})
  _clear_auth_cookies(response, _default_cookie_domain())
  return response


@router.get("/google/login")
def start_google_login(next: str | None = None) -> RedirectResponse:
  next_path = _normalize_next_path(next)

  try:
    state = issue_oauth_state(provider="google", next_path=next_path)
    authorize_url = build_google_authorize_url(state=state)
  except GoogleOAuthError:
    return RedirectResponse(url=FRONTEND_AUTH_ERROR_URL, status_code=302)

  return RedirectResponse(url=authorize_url, status_code=302)


@router.post("/sso-loign-token-issue")
@router.post("/sso-login-token-issue")
def issue_sso_login_token(payload: SsoTokenIssueRequest) -> JSONResponse:
  provider = payload.provider.strip().lower()
  email, provider_subject, display_name, avatar_url = _process_sso_callback(
    provider=provider,
    callback_token=payload.callback_token
  )

  response = JSONResponse(
    {
      "ok": True,
      "email": email,
      "provider": provider
    }
  )
  _set_auth_cookies(
    response,
    email=email,
    provider=provider,
    provider_subject=provider_subject,
    display_name=display_name,
    avatar_url=avatar_url,
    cookie_domain=_cookie_domain_from_request(payload)
  )
  return response


@router.get("/{provider}/callback")
def handle_provider_callback(
  provider: str,
  code: str | None = None,
  state: str | None = None,
  token: str | None = None,
  id_token: str | None = None,
  credential: str | None = None
) -> RedirectResponse:
  provider_name = provider.strip().lower()

  if provider_name == "google" and code:
    if not state:
      return RedirectResponse(url=FRONTEND_AUTH_ERROR_URL, status_code=302)

    try:
      state_payload = verify_oauth_state(state=state, expected_provider="google")
      tokens = exchange_google_code_for_tokens(code=code)
      profile = fetch_google_user_profile_from_tokens(tokens)
      email, provider_subject, display_name, avatar_url = _process_sso_profile(provider=provider_name, profile=profile)
      success_redirect_url = _build_success_redirect_url(state_payload.get("next"))
    except (OAuthStateError, GoogleOAuthError, HTTPException):
      return RedirectResponse(url=FRONTEND_AUTH_ERROR_URL, status_code=302)

    response = RedirectResponse(url=success_redirect_url, status_code=302)
    cookie_domain = _default_cookie_domain()
    _set_auth_cookies(
      response,
      email=email,
      provider=provider_name,
      provider_subject=provider_subject,
      display_name=display_name,
      avatar_url=avatar_url,
      cookie_domain=cookie_domain
    )
    return response

  callback_token = token or id_token or credential or ""
  if not callback_token:
    return RedirectResponse(url=FRONTEND_AUTH_ERROR_URL, status_code=302)

  try:
    email, provider_subject, display_name, avatar_url = _process_sso_callback(
      provider=provider_name,
      callback_token=callback_token
    )
  except HTTPException:
    return RedirectResponse(url=FRONTEND_AUTH_ERROR_URL, status_code=302)

  response = RedirectResponse(url=FRONTEND_AUTH_SUCCESS_URL, status_code=302)
  cookie_domain = _default_cookie_domain()
  _set_auth_cookies(
    response,
    email=email,
    provider=provider_name,
    provider_subject=provider_subject,
    display_name=display_name,
    avatar_url=avatar_url,
    cookie_domain=cookie_domain
  )
  return response
