import asyncio
import hashlib
import json
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from graph_client import fetch_fichas

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

POLL_INTERVAL = 20  # segundos

# Estado global en memoria
cache: dict = {
    "data": [],
    "hash": "",
    "last_updated": None,
    "error": None,
}


async def _refresh():
    """Consulta el Excel y actualiza el cache si hubo cambios."""
    try:
        fichas = await fetch_fichas()
        new_hash = hashlib.md5(json.dumps(fichas, ensure_ascii=False).encode()).hexdigest()
        if new_hash != cache["hash"]:
            cache["data"] = fichas
            cache["hash"] = new_hash
            log.info(f"Cache actualizado — {len(fichas)} filas")
        else:
            log.info("Sin cambios en el Excel")
        cache["error"] = None
    except Exception as exc:
        log.error(f"Error al leer Excel: {exc}")
        cache["error"] = str(exc)


async def _poll_loop():
    """Background task: refresca cada POLL_INTERVAL segundos."""
    while True:
        await _refresh()
        await asyncio.sleep(POLL_INTERVAL)


@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(_poll_loop())
    yield
    task.cancel()


app = FastAPI(title="Fichas Dashboard API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/fichas")
async def get_fichas():
    if cache["error"] and not cache["data"]:
        raise HTTPException(status_code=503, detail=cache["error"])
    return {
        "data": cache["data"],
        "total": len(cache["data"]),
        "error": cache["error"],
    }


@app.get("/health")
async def health():
    return {"status": "ok", "cached_rows": len(cache["data"])}
