import pytest
from sqlalchemy import select

from app.auth.utils import hash_password
from app.models.catalog import HistoryOption, Medication
from app.models.user import User, UserRole
from seeds.seed_catalog import seed as seed_catalog

pytestmark = pytest.mark.asyncio

PASSWORD = "password123"


async def make_user(db, role: UserRole, email: str) -> User:
    existing = (await db.execute(select(User).where(User.email == email))).scalars().first()
    if existing:
        return existing
    user = User(email=email, password_hash=hash_password(PASSWORD), role=role, full_name_en=email.split("@")[0], full_name_ar="اختبار")
    db.add(user)
    await db.commit()
    return user


async def login(client, email: str) -> dict:
    res = await client.post("/api/v1/auth/login", json={"email": email, "password": PASSWORD})
    assert res.status_code == 200, res.text
    return {"Authorization": f"Bearer {res.json()['access_token']}"}


async def all_no_history(db, is_child: bool = False) -> dict:
    options = (await db.execute(select(HistoryOption))).scalars().all()
    target = "child" if is_child else "adult"
    return {o.code: {"answer": "no"} for o in options if o.applies_to in ("all", target)}


async def test_patient_to_doctor_flow(client, db_session):
    await seed_catalog(db_session)
    await make_user(db_session, UserRole.patient, "flow-patient@example.com")
    await make_user(db_session, UserRole.doctor, "flow-doctor@example.com")
    await make_user(db_session, UserRole.receptionist, "flow-reception@example.com")
    patient = await login(client, "flow-patient@example.com")
    doctor = await login(client, "flow-doctor@example.com")
    reception = await login(client, "flow-reception@example.com")

    res = await client.get("/api/v1/intake/me", headers=patient)
    assert res.status_code == 200
    assert "allergy_answer" in res.json()["missing"]

    # Submitting with blanks is rejected: a blank answer never counts as "no".
    res = await client.post("/api/v1/intake/me/submit", headers=patient)
    assert res.status_code == 422

    med = (await db_session.execute(select(Medication).where(Medication.brand_name == "Augmentin"))).scalars().first()
    res = await client.put("/api/v1/intake/me", headers=patient, json={"consent": True, "allergy_answer": "yes"})
    assert "allergy_details" in res.json()["missing"]

    res = await client.put("/api/v1/intake/me", headers=patient, json={"allergies": [{"medication_id": str(med.id), "reaction": "free text"}]})
    assert res.status_code == 422

    history = await all_no_history(db_session)
    history["nasal_blockage"] = {"answer": "yes", "side": "left", "onset": "gt_1y"}
    res = await client.put(
        "/api/v1/intake/me",
        headers=patient,
        json={"allergies": [{"medication_id": str(med.id), "reaction": "rash"}], "history": history},
    )
    assert res.status_code == 200
    assert res.json()["missing"] == []

    res = await client.post("/api/v1/intake/me/submit", headers=patient)
    assert res.status_code == 200
    intake_id = res.json()["id"]
    assert res.json()["status"] == "complete"

    # Receptionist sees status, never clinical details.
    res = await client.get("/api/v1/intakes", headers=reception)
    row = next(r for r in res.json() if r["id"] == intake_id)
    assert row["has_allergy"] is None
    assert (await client.get(f"/api/v1/intakes/{intake_id}", headers=reception)).status_code == 403

    res = await client.get(f"/api/v1/intakes/{intake_id}", headers=doctor)
    assert res.json()["allergies"][0]["medication"]["brand_name"] == "Augmentin"

    res = await client.post(f"/api/v1/intakes/{intake_id}/confirm", headers=doctor, json={"unchanged": False})
    assert res.json()["status"] == "doctor_confirmed"

    # Patient can no longer edit a confirmed intake.
    res = await client.put("/api/v1/intake/me", headers=patient, json={"allergy_answer": "no"})
    assert res.status_code == 409


async def test_child_needs_age_and_weight(client, db_session):
    await seed_catalog(db_session)
    await make_user(db_session, UserRole.patient, "child-parent@example.com")
    patient = await login(client, "child-parent@example.com")
    history = await all_no_history(db_session, is_child=True)
    res = await client.put(
        "/api/v1/intake/me",
        headers=patient,
        json={"consent": True, "filled_by": "parent", "is_child": True, "allergy_answer": "no", "history": history},
    )
    assert res.json()["missing"] == ["child_details"]
    res = await client.put("/api/v1/intake/me", headers=patient, json={"child_age_years": 6, "child_weight_kg": 21.5})
    assert res.json()["missing"] == []


async def test_patient_cannot_use_staff_endpoints(client, db_session):
    await make_user(db_session, UserRole.patient, "nosy@example.com")
    patient = await login(client, "nosy@example.com")
    assert (await client.get("/api/v1/intakes", headers=patient)).status_code == 403
