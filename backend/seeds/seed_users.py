from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User, UserRole
from app.auth.utils import hash_password

async def seed(db: AsyncSession):
    users_to_seed = [
        {
            "email": "doctor@auraent.local",
            "password": "doctor123",
            "role": UserRole.doctor,
            "full_name_en": "Dr. Mohamed Khalil",
            "full_name_ar": "د. محمد خليل",
        },
        {
            "email": "receptionist@auraent.local",
            "password": "reception123",
            "role": UserRole.receptionist,
            "full_name_en": "Sarah Ahmed",
            "full_name_ar": "سارة أحمد",
        },
        {
            "email": "assistant@auraent.local",
            "password": "assistant123",
            "role": UserRole.assistant,
            "full_name_en": "Amira Hassan",
            "full_name_ar": "أميرة حسن",
        },
        {
            "email": "patient@auraent.local",
            "password": "patient123",
            "role": UserRole.patient,
            "full_name_en": "Ahmed Mostafa",
            "full_name_ar": "أحمد مصطفى",
        },
    ]

    for user_data in users_to_seed:
        result = await db.execute(select(User).where(User.email == user_data["email"]))
        existing = result.scalars().first()
        if not existing:
            new_user = User(
                email=user_data["email"],
                password_hash=hash_password(user_data["password"]),
                role=user_data["role"],
                full_name_en=user_data["full_name_en"],
                full_name_ar=user_data["full_name_ar"],
            )
            db.add(new_user)
            print(f"Seeded user: {user_data['email']}")
        else:
            print(f"User {user_data['email']} already exists.")
    
    await db.commit()
