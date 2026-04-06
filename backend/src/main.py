from fastapi import FastAPI, Request

from auth import router as auth_router

app = FastAPI()
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.api_route("/api/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
async def api_proxy_test(path: str, request: Request) -> dict[str, str]:
    return {
        "message": "Backend reached through nginx proxy",
        "method": request.method,
        "path": f"/api/{path}",
    }
