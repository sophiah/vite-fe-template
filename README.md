# Project Workspace

This repository is split into:

- `frontend/`: Vite + React frontend app (moved from repository root)
- `backend/`: backend service workspace (placeholder)

## Frontend

Run frontend locally from `frontend/` and docker from repository root:

```bash
cd frontend
yarn install
yarn dev
```

```bash
cd ..
make docker-up
```

## SSO Auth Flow (Backend Callback First)

The recommended login flow is handled by backend callback endpoints.

1. User clicks Google login in frontend.
2. Frontend redirects browser to backend OAuth start endpoint:
   - `/api/auth/google/login`
3. Backend builds Google authorize URL and redirects to Google.
4. Google redirects back to backend callback:
   - `/api/auth/google/callback?code=...&state=...`
5. Backend callback endpoint:
   - validates signed `state`
   - exchanges `code` for tokens with Google
   - fetches user profile (`email/sub/name`)
   - upserts user data into:
     - `users` (email as primary key)
     - `user_sso_identities` (provider-aware mapping for multi-SSO)
   - issues app self-signed auth cookie for `COOKIE_DOMAIN`
6. Backend returns `302` redirect to frontend success URL (`FRONTEND_AUTH_SUCCESS_URL`).
7. Frontend continues with an authenticated session via HttpOnly cookie.

## Backend Secret ENV

Create `backend/.secret` (you can copy from `backend/.secret.example`) and set:

```bash
SSO_GOOGLE_CLIENT_ID=...
SSO_GOOGLE_CLIENT_SECRET=...
SSO_GOOGLE_REDIRECT_URI=https://localhost:8000/api/auth/google/callback
```

`docker-compose.yml` loads this file into backend via `env_file`.

Legacy env names are still accepted for compatibility:
- `GOOGLE_OAUTH_CLIENT`
- `GOOGLE_CLIENT_SECRET`

Session endpoints used by frontend auth state:
- `GET /api/auth/session`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

Compatibility endpoint still exists for staged migration:
- `POST /api/auth/sso-loign-token-issue`
- `POST /api/auth/sso-login-token-issue`

## Frontend Route Permission Schema

Each page `routeMeta` should use:

```js
permission: {
  public: true | false,
  auth: true | false,
  ability: 'read' | 'write' | 'manage' | ...,
  subject: 'category1' | 'group-a' | ...
}
```

Permission evaluation is centralized in:
- `frontend/src/core/routes/AppRoutes/AppRoutes.js`

Rules:
- Permission is checked as a chain by path hierarchy (parent -> child), and all layers must pass.
- If `permission` is omitted, default is:
  - `public: false`
  - `auth: true`
  - `ability: null`
  - `subject: null`
- If `ability` or `subject` is set, it is treated as protected route:
  - `public` becomes `false`
  - `auth` becomes `true`
