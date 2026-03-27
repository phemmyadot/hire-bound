from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.config import settings

engine = create_async_engine(settings.database_url, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session


async def create_tables() -> None:
    async with engine.begin() as conn:
        from app import models  # noqa: F401 — ensures models are registered
        await conn.run_sync(Base.metadata.create_all)
    await _seed_prompts()


async def _seed_prompts() -> None:
    from app.models import Prompt
    from app.prompt_seeds import DEFAULT_PROMPTS

    async with AsyncSessionLocal() as session:
        for seed in DEFAULT_PROMPTS:
            result = await session.execute(select(Prompt).where(Prompt.name == seed["name"]))
            existing = result.scalar_one_or_none()
            if existing is None:
                session.add(Prompt(**seed))
        await session.commit()
