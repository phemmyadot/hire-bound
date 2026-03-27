from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models import Prompt, User
from app.schemas import PromptOut, PromptUpdate

router = APIRouter(prefix="/prompts", tags=["prompts"])


@router.get("", response_model=list[PromptOut])
async def list_prompts(
    _: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Prompt).order_by(Prompt.name))
    return result.scalars().all()


@router.get("/{name}", response_model=PromptOut)
async def get_prompt(
    name: str,
    _: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Prompt).where(Prompt.name == name))
    prompt = result.scalar_one_or_none()
    if not prompt:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Prompt '{name}' not found")
    return prompt


@router.patch("/{name}", response_model=PromptOut)
async def update_prompt(
    name: str,
    body: PromptUpdate,
    _: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Prompt).where(Prompt.name == name))
    prompt = result.scalar_one_or_none()
    if not prompt:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Prompt '{name}' not found")
    prompt.content = body.content
    if body.description is not None:
        prompt.description = body.description
    await db.commit()
    await db.refresh(prompt)
    return prompt
