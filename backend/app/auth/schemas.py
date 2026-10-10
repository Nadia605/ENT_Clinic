from typing import Literal, Optional
from pydantic import BaseModel, EmailStr, Field
from uuid import UUID

RoleName = Literal["patient", "doctor", "receptionist", "assistant"]

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    role: Optional[RoleName] = None

class RegisterRequest(BaseModel):
    full_name: str = Field(min_length=3, max_length=120)
    email: EmailStr
    phone: str = Field(pattern=r"^01[0125]\d{8}$")
    password: str = Field(min_length=8, max_length=128)
    role: RoleName = "patient"
    preferred_language: Literal["ar", "en"] = "ar"

class RegisterResponse(BaseModel):
    id: UUID
    email: EmailStr
    role: RoleName
    status: Literal["active", "pending"]

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenPayload(BaseModel):
    sub: str
    role: str
    exp: int
