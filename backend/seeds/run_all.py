import asyncio
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database import async_sessionmaker_instance
from seeds.seed_clinic_settings import seed as seed_settings
from seeds.seed_users import seed as seed_users
from seeds.seed_catalog import seed as seed_catalog

async def main():
    async with async_sessionmaker_instance() as session:
        print("Running seeders...")
        await seed_settings(session)
        await seed_users(session)
        await seed_catalog(session)
        print("Seeding complete.")

if __name__ == "__main__":
    asyncio.run(main())
