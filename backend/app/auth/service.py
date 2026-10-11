from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from .schemas import RegisterRequest, TokenResponse
from .utils import hash_password, verify_password, create_access_token, create_refresh_token
from app.models.user import User, UserRole

async def register_user(db: AsyncSession, req: RegisterRequest) -> User | None:
    """Create a patient account. Staff accounts are provisioned by the doctor, never self-registered."""
    email = req.email.lower()
    existing = await db.execute(select(User).where(User.email == email))
    if existing.scalars().first():
        return None

    role = UserRole(req.role)
    name = req.full_name.strip()
    user = User(
        email=email,
        password_hash=hash_password(req.password),
        role=role,
        full_name_en=name,
        full_name_ar=name,
        phone=req.phone,
        preferred_language=req.preferred_language,
        is_active=role == UserRole.patient,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

async def authenticate_user(db: AsyncSession, email: str, password: str) -> User | None:
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user

def create_tokens(user: User) -> TokenResponse:
    access_token = create_access_token(data={"sub": str(user.id), "role": user.role.value})
    refresh_token = create_refresh_token(data={"sub": str(user.id), "role": user.role.value})
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)
