from datetime import datetime
from typing import Any

from pydantic import BaseModel, EmailStr


# ── Auth ────────────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    email: str


class UserOut(BaseModel):
    id: int
    email: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Resumes ─────────────────────────────────────────────────────────────────

class ResumeCreate(BaseModel):
    name: str = "Untitled Resume"
    data: dict[str, Any]


class ResumeUpdate(BaseModel):
    name: str | None = None
    data: dict[str, Any] | None = None


class ResumeOut(BaseModel):
    id: int
    name: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ResumeDetail(ResumeOut):
    data: dict[str, Any]


# ── Prompts ──────────────────────────────────────────────────────────────────

class PromptOut(BaseModel):
    name: str
    description: str
    content: str
    updated_at: datetime

    model_config = {"from_attributes": True}


class PromptUpdate(BaseModel):
    content: str
    description: str | None = None


# ── Claude proxy ─────────────────────────────────────────────────────────────

class ClaudeRequest(BaseModel):
    prompt_name: str                    # "resume" or "jobs"
    user_content: Any = None            # resume text + JD for "resume"; None for "jobs"
    max_tokens: int = 4000
    vars: dict[str, Any] = {}
