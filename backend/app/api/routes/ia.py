import logging

import httpx
from fastapi import APIRouter

from app.config import settings
from app.schemas.ia import ChatRequest, ChatResponse

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ia", tags=["IA"])
FALLBACK_REPLY = (
    "Puedo ayudarte a completar el trámite. Revisa los datos del titular, "
    "la ubicación, el tipo de aprovechamiento y los soportes de la autoridad "
    "seleccionada."
)


@router.post("/chat", response_model=ChatResponse)
async def chat(payload: ChatRequest) -> ChatResponse:
    if not settings.NVIDIA_API_KEY:
        return ChatResponse(reply=FALLBACK_REPLY, fallback=True)

    request_body = {
        "model": settings.NVIDIA_MODEL,
        "messages": [message.model_dump() for message in payload.messages],
        "temperature": 0.2,
        "max_tokens": 500,
    }
    try:
        async with httpx.AsyncClient(timeout=httpx.Timeout(20.0)) as client:
            response = await client.post(
                settings.NVIDIA_API_URL,
                headers={
                    "Authorization": f"Bearer {settings.NVIDIA_API_KEY}",
                    "Content-Type": "application/json",
                },
                json=request_body,
            )
            response.raise_for_status()
            content = response.json()["choices"][0]["message"]["content"]
            if not isinstance(content, str) or not content.strip():
                raise ValueError("Nvidia returned an empty response")
            return ChatResponse(reply=content.strip(), model=settings.NVIDIA_MODEL)
    except (httpx.HTTPError, KeyError, IndexError, TypeError, ValueError):
        logger.exception("Nvidia chat request failed")
        return ChatResponse(
            reply=FALLBACK_REPLY,
            fallback=True,
            model=settings.NVIDIA_MODEL,
        )
