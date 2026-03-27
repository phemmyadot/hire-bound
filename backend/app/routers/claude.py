from urllib.parse import quote_plus

import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.dependencies import get_current_user
from app.models import Prompt, User
from app.prompt_seeds import RESUME_JD_BLOCK, RESUME_NO_JD_BLOCK
from app.schemas import ClaudeRequest

router = APIRouter(prefix="/claude", tags=["claude"])

CLAUDE_MODEL = "claude-sonnet-4-6"
ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages"


def _render(template: str, vars: dict) -> str:
    """Replace <<VAR>> placeholders in template."""
    result = template
    for key, value in vars.items():
        result = result.replace(f"<<{key.upper()}>>", str(value) if value is not None else "")
    return result


async def _get_prompt(name: str, db: AsyncSession) -> str:
    result = await db.execute(select(Prompt).where(Prompt.name == name))
    prompt = result.scalar_one_or_none()
    if not prompt:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Prompt '{name}' not found")
    return prompt.content


@router.post("")
async def proxy_claude(
    body: ClaudeRequest,
    _: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if body.prompt_name == "resume":
        system, user_content = await _build_resume(body, db)
    elif body.prompt_name == "jobs":
        system, user_content = await _build_jobs(body, db)
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Unknown prompt '{body.prompt_name}'")

    return await _call_anthropic(system, user_content, body.max_tokens)


# ── prompt builders ──────────────────────────────────────────────────────────

async def _build_resume(body: ClaudeRequest, db: AsyncSession):
    template = await _get_prompt("resume_system", db)

    has_jd = bool(body.vars.get("has_jd", False))
    yoe_raw = body.vars.get("years_of_experience") or None
    yoe = yoe_raw or "calculated from the work history dates"
    yoe_label = yoe_raw or "X"
    title = body.vars.get("job_title") or "inferred from the most recent role"
    jd_block = RESUME_JD_BLOCK if has_jd else RESUME_NO_JD_BLOCK

    system = _render(template, {
        "JD_BLOCK": jd_block,
        "YOE": yoe,
        "YOE_LABEL": yoe_label,
        "TITLE": title,
    })
    return system, body.user_content


async def _build_jobs(body: ClaudeRequest, db: AsyncSession):
    system = await _get_prompt("jobs_system", db)
    user_template = await _get_prompt("jobs_user", db)

    title = body.vars.get("title", "Software Engineer")
    skills = body.vars.get("skills", "")
    location = body.vars.get("location", "")
    jd_snippet = (body.vars.get("jd_snippet") or "not provided")[:400]
    q = quote_plus(title)
    l = quote_plus(location)

    user_content = _render(user_template, {
        "TITLE": title,
        "SKILLS": skills,
        "LOCATION": location,
        "JD_SNIPPET": jd_snippet,
        "Q": q,
        "L": l,
    })
    return system, user_content


# ── Anthropic call ───────────────────────────────────────────────────────────

async def _call_anthropic(system: str, user_content, max_tokens: int):
    payload = {
        "model": CLAUDE_MODEL,
        "max_tokens": max_tokens,
        "system": system,
        "messages": [{"role": "user", "content": user_content}],
    }
    async with httpx.AsyncClient(timeout=120.0) as client:
        resp = await client.post(
            ANTHROPIC_API_URL,
            json=payload,
            headers={
                "x-api-key": settings.anthropic_api_key,
                "anthropic-version": "2023-06-01",
                "Content-Type": "application/json",
            },
        )
    if resp.status_code != 200:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=f"Anthropic error: {resp.text}")
    return resp.json()
