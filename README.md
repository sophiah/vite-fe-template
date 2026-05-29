# Project Workspace

This repository contains a full-stack project workspace.

## Repository Structure

```bash
.
├── frontend/   # Vite + React frontend app
├── backend/    # FastAPI backend service
├── docker-compose.yml
├── Makefile
└── README.md
```

## Tech Stack

### Frontend

* Vite
* React
* JavaScript
* MUI
* AG Grid

### Backend

* FastAPI
* Python
* OAuth / SSO authentication
* HttpOnly cookie-based session handling

---

# Quick Start

## Option 1: Run with Docker

This is the recommended way to start the full project.

From the repository root:

```bash
make docker-up
```

If `make` is not available, use Docker Compose directly:

```bash
docker compose up --build
```

To stop services:

```bash
docker compose down
```

---

# Windows Setup

## Recommended: Docker Desktop + WSL 2

For Windows, the recommended setup is:

1. Install Docker Desktop for Windows.
2. Enable WSL 2 integration in Docker Desktop.
3. Open the project in WSL, PowerShell, or VS Code.
4. Start Docker Desktop.
5. Run from the repository root:

```bash
docker compose up --build
```

If `make` is available in your environment, you can also run:

```bash
make docker-up
```

## Notes for Windows Users

* Keep Docker Desktop running before starting the project.
* Prefer `docker compose` instead of legacy `docker-compose`.
* If using WSL, run commands inside the Linux shell from the repository root.
* If port conflicts happen, check whether another local service is already using the same frontend or backend port.

---

# Frontend Local Development

Run frontend locally from the `frontend/` folder:

```bash
cd frontend
yarn install
yarn dev
```

Use this mode when working only on frontend UI development.

For full-stack development, Docker is preferred.

---

# Backend Environment Setup

Create a backend secret file:

```bash
backend/.secret
```

You can copy from:

```bash
backend/.secret.example
```

Required Google SSO values:

```bash
SSO_GOOGLE_CLIENT_ID=...
SSO_GOOGLE_CLIENT_SECRET=...
SSO_GOOGLE_REDIRECT_URI=https://localhost:8000/api/auth/google/callback
```

`docker-compose.yml` loads this file into the backend service through `env_file`.

Legacy environment variable names are still supported for compatibility:

```bash
GOOGLE_OAUTH_CLIENT=...
GOOGLE_CLIENT_SECRET=...
```

---

# SSO Auth Flow

The recommended login flow is handled by backend callback endpoints.

1. User clicks Google login in the frontend.
2. Frontend redirects the browser to the backend OAuth start endpoint:

```bash
/api/auth/google/login
```

3. Backend builds the Google authorize URL and redirects the user to Google.
4. Google redirects back to the backend callback endpoint:

```bash
/api/auth/google/callback?code=...&state=...
```

5. Backend callback endpoint:

* validates signed `state`
* exchanges `code` for Google tokens
* fetches Google user profile data such as `email`, `sub`, and `name`
* upserts user data into:

  * `users`
  * `user_sso_identities`
* issues the app auth cookie for `COOKIE_DOMAIN`

6. Backend returns a `302` redirect to `FRONTEND_AUTH_SUCCESS_URL`.
7. Frontend continues with an authenticated session through the HttpOnly cookie.

---

# Auth Session Endpoints

Frontend auth state uses:

```bash
GET  /api/auth/session
POST /api/auth/refresh
POST /api/auth/logout
```

Compatibility endpoints still exist for staged migration:

```bash
POST /api/auth/sso-loign-token-issue
POST /api/auth/sso-login-token-issue
```

---

# Frontend Route Permission Schema

Each page `routeMeta` may define permission metadata:

```js
permission: {
  public: true | false,
  auth: true | false,
  ability: 'read' | 'write' | 'manage',
  subject: 'category1'
}
```

Permission evaluation is centralized in:

```bash
frontend/src/core/routes/AppRoutes/AppRoutes.js
```

## Permission Rules

* Permission is checked by path hierarchy from parent to child.
* All route layers must pass permission checks.
* If `permission` is omitted, the default is:

```js
{
  public: false,
  auth: true,
  ability: null,
  subject: null
}
```

* If `ability` or `subject` is set, the route is treated as protected:

```js
{
  public: false,
  auth: true
}
```

---

# Common Commands

## Start full stack with Docker

```bash
docker compose up --build
```

## Stop Docker services

```bash
docker compose down
```

## Start frontend only

```bash
cd frontend
yarn dev
```

## Install frontend dependencies

```bash
cd frontend
yarn install
```

---

# Development Notes

* Use Docker for full-stack local development.
* Use frontend local mode only when backend services are not needed.
* Keep secret values out of source control.
* Backend SSO secrets should live in `backend/.secret`.
* Frontend route permissions should be defined through `routeMeta`.
