# Backend

FastAPI backend service.

Implementation lives under `src/`.

## Folder Structure

API code is organized by first-layer path segment.

- `/api/auth/*` lives under `src/auth/`
- Shared DB connectivity lives under `src/database/`

## SSO Token Issue Endpoint

- `GET /api/auth/{provider}/callback` (recommended browser callback endpoint)
- `GET /api/auth/google/login` (recommended OAuth start endpoint)
- `GET /api/auth/session` (frontend login state check)
- `POST /api/auth/refresh` (rotate and re-issue access/refresh cookies)
- `POST /api/auth/logout` (clear auth cookie)
- `POST /api/auth/sso-loign-token-issue` (kept for compatibility with existing FE flow)
- `POST /api/auth/sso-login-token-issue` (corrected spelling alias)

Request body:

```json
{
  "provider": "google",
  "callbackToken": "<provider callback token>",
  "cookieDomain": "localhost"
}
```

The endpoint extracts email claims, upserts:
- `users`
- `user_sso_identities` (provider-aware for future multi-SSO)

Then it issues self-signed access/refresh tokens and sets them in HTTP-only cookies.

## Google OAuth ENV

Set these in `backend/.secret`:

- `SSO_GOOGLE_CLIENT_ID`
- `SSO_GOOGLE_CLIENT_SECRET`
- `SSO_GOOGLE_REDIRECT_URI` (default: `https://localhost:8000/api/auth/google/callback`)
