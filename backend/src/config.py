import os


def _read_bool(env_name: str, default: bool) -> bool:
  raw_value = os.getenv(env_name)

  if raw_value is None:
    return default

  return raw_value.strip().lower() in {"1", "true", "yes", "on"}


APP_AUTH_SECRET = os.getenv("APP_AUTH_SECRET", "dev-self-signed-secret")
AUTH_COOKIE_NAME = os.getenv("AUTH_COOKIE_NAME", "app_auth_token")
AUTH_TOKEN_TTL_SECONDS = int(os.getenv("AUTH_TOKEN_TTL_SECONDS", str(60 * 60 * 24 * 7)))
REFRESH_COOKIE_NAME = os.getenv("REFRESH_COOKIE_NAME", "app_refresh_token")
REFRESH_TOKEN_TTL_SECONDS = int(os.getenv("REFRESH_TOKEN_TTL_SECONDS", str(60 * 60 * 24 * 30)))
COOKIE_DOMAIN = os.getenv("COOKIE_DOMAIN")
COOKIE_SECURE = _read_bool("COOKIE_SECURE", True)
COOKIE_SAMESITE = os.getenv("COOKIE_SAMESITE", "lax")
DATABASE_URL = os.getenv("DATABASE_URL")
FRONTEND_AUTH_SUCCESS_URL = os.getenv("FRONTEND_AUTH_SUCCESS_URL", "https://localhost:8000/")
FRONTEND_AUTH_ERROR_URL = os.getenv("FRONTEND_AUTH_ERROR_URL", "https://localhost:8000/?authError=1")

SSO_GOOGLE_CLIENT_ID = (
  os.getenv("SSO_GOOGLE_CLIENT_ID")
  or os.getenv("GOOGLE_OAUTH_CLIENT")
  or os.getenv("GOOGLE_CLIENT_ID")
)
SSO_GOOGLE_CLIENT_SECRET = (
  os.getenv("SSO_GOOGLE_CLIENT_SECRET")
  or os.getenv("GOOGLE_CLIENT_SECRET")
)
SSO_GOOGLE_REDIRECT_URI = os.getenv("SSO_GOOGLE_REDIRECT_URI", "https://localhost:8000/api/auth/google/callback")
SSO_GOOGLE_SCOPE = os.getenv("SSO_GOOGLE_SCOPE", "openid email profile")
SSO_GOOGLE_AUTH_URL = os.getenv("SSO_GOOGLE_AUTH_URL", "https://accounts.google.com/o/oauth2/v2/auth")
SSO_GOOGLE_TOKEN_URL = os.getenv("SSO_GOOGLE_TOKEN_URL", "https://oauth2.googleapis.com/token")
SSO_GOOGLE_USERINFO_URL = os.getenv("SSO_GOOGLE_USERINFO_URL", "https://openidconnect.googleapis.com/v1/userinfo")
SSO_OAUTH_STATE_TTL_SECONDS = int(os.getenv("SSO_OAUTH_STATE_TTL_SECONDS", "600"))
