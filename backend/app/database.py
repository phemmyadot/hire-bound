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


async def seed_prompts() -> None:
    """Insert default prompts if they don't exist yet.

    Safe to call on every startup — rows are only inserted when absent.
    Schema must already exist (run `alembic upgrade head` first).
    """
    from app.models import Prompt
    from app.prompt_seeds import DEFAULT_PROMPTS

    async with AsyncSessionLocal() as session:
        for seed in DEFAULT_PROMPTS:
            result = await session.execute(select(Prompt).where(Prompt.name == seed["name"]))
            if result.scalar_one_or_none() is None:
                session.add(Prompt(**seed))
        await session.commit()
