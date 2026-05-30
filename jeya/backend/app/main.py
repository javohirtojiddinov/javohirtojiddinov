from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import auth, chat, documents, files, memory, voice
from app.core.config import settings

app = FastAPI(
    title="JEYA API",
    description="O'zbek tilida AI yordamchi platformasi — backend API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["chat"])
app.include_router(documents.router, prefix="/api/v1/documents", tags=["documents"])
app.include_router(files.router, prefix="/api/v1/files", tags=["files"])
app.include_router(memory.router, prefix="/api/v1/memory", tags=["memory"])
app.include_router(voice.router, prefix="/api/v1/voice", tags=["voice"])


@app.get("/health")
async def health():
    return {"status": "ok", "service": "JEYA API"}


@app.get("/")
async def root():
    return {"service": "JEYA API", "version": "1.0.0", "docs": "/docs"}
