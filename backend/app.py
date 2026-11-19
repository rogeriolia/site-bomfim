from fastapi import FastAPI

from backend.routes import coverage, leads, telemetry

app = FastAPI(title="Bomfim Site API", docs_url=None, redoc_url=None)


@app.get("/")
def api_root() -> dict:
    return {
        "service": "bomfim-site-api",
        "message": "Esta porta é só a API. O site abre em http://localhost:5173/ (python run.py ou npm run dev).",
        "endpoints": [
            "POST /api/leads.php",
            "POST /api/telemetry.php",
            "POST /api/coverage-check.php",
        ],
    }


app.include_router(leads.router)
app.include_router(telemetry.router)
app.include_router(coverage.router)