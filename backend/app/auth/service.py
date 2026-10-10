from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from .schemas import TokenResponse
from .utils import verify_password, create_access_token, create_refresh_token
from app.models.user import User

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
