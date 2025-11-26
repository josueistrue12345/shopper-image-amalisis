from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import analysis
from app.routes import checklist
from app.routes import upload
from app.routes import images
from app.routes import prompts
from app.routes import websocket
from app.core.broadcast import broadcast

@asynccontextmanager
async def lifespan(app: FastAPI):
    await broadcast.connect()
    yield
    await broadcast.disconnect()

app = FastAPI(title="Mobo Analyzer API", lifespan=lifespan)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=False,
    allow_methods=["GET","POST"],
    allow_headers=["GET","POST"],
)

# Include routers
app.include_router(checklist.router, prefix="/api", tags=["analysis"])
app.include_router(analysis.router, prefix="/api", tags=["checklist"])
app.include_router(upload.router, prefix="/api", tags=["upload"])
app.include_router(images.router, prefix="/api", tags=["images"])
app.include_router(prompts.router, prefix="/api", tags=["prompts"])
app.include_router(websocket.router, prefix="/api", tags=["websocket"])

@app.get("/api")
def test():
    return {"message": "Mobo Analyzer Backend OK"}
