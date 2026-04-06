from fastapi import FastAPI, Request

app = FastAPI()


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
