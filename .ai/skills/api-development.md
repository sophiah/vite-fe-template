# API Development Guidelines

Backend uses FastAPI under `backend/src/`. Do not generate Node.js / Express patterns.

Use domain-based API folders:

`backend/src/api/{domain}/`

Rules:
- routes → `backend/src/api/{domain}/routes.py`
- schemas → `backend/src/api/{domain}/schemas.py`
- service/business logic → `backend/src/api/{domain}/service.py` when needed
- use FastAPI `APIRouter`
- register routers in `backend/src/main.py` or existing central router file
- keep route handlers thin
- do not mix unrelated domains in one folder
- follow existing local patterns before adding new structure

For `/api/{domain}`, update/create `backend/src/api/{domain}/routes.py`.