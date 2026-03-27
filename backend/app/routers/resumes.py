import json

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models import Resume, User
from app.schemas import ResumeCreate, ResumeDetail, ResumeOut, ResumeUpdate

router = APIRouter(prefix="/resumes", tags=["resumes"])


@router.get("", response_model=list[ResumeOut])
async def list_resumes(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Resume).where(Resume.user_id == current_user.id).order_by(Resume.updated_at.desc())
    )
    return result.scalars().all()


@router.post("", response_model=ResumeDetail, status_code=status.HTTP_201_CREATED)
async def create_resume(
    body: ResumeCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    resume = Resume(
        user_id=current_user.id,
        name=body.name,
        data=json.dumps(body.data),
    )
    db.add(resume)
    await db.commit()
    await db.refresh(resume)
    return _to_detail(resume)


@router.get("/{resume_id}", response_model=ResumeDetail)
async def get_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    resume = await _get_owned(resume_id, current_user.id, db)
    return _to_detail(resume)


@router.patch("/{resume_id}", response_model=ResumeDetail)
async def update_resume(
    resume_id: int,
    body: ResumeUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    resume = await _get_owned(resume_id, current_user.id, db)
    if body.name is not None:
        resume.name = body.name
    if body.data is not None:
        resume.data = json.dumps(body.data)
    await db.commit()
    await db.refresh(resume)
    return _to_detail(resume)


@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    resume = await _get_owned(resume_id, current_user.id, db)
    await db.delete(resume)
    await db.commit()


# ── helpers ──────────────────────────────────────────────────────────────────

async def _get_owned(resume_id: int, user_id: int, db: AsyncSession) -> Resume:
    result = await db.execute(
        select(Resume).where(Resume.id == resume_id, Resume.user_id == user_id)
    )
    resume = result.scalar_one_or_none()
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
    return resume


def _to_detail(resume: Resume) -> ResumeDetail:
    return ResumeDetail(
        id=resume.id,
        name=resume.name,
        data=json.loads(resume.data),
        created_at=resume.created_at,
        updated_at=resume.updated_at,
    )
