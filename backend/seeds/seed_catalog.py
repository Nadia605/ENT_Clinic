"""Placeholder catalogs. Every row is flagged `is_placeholder=True` until the Doctor reviews it."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.catalog import HistoryOption, Medication

# (code, category, name_en, name_ar, applies_to, has_side)
HISTORY = [
    ("ear_pain", "ear", "Ear pain", "ألم في الأذن", "all", True),
    ("ear_discharge", "ear", "Ear discharge", "إفرازات من الأذن", "all", True),
    ("hearing_loss", "ear", "Reduced hearing", "ضعف في السمع", "all", True),
    ("tinnitus", "ear", "Ringing in the ear", "طنين في الأذن", "adult", True),
    ("vertigo", "ear", "Dizziness or vertigo", "دوخة أو دوار", "adult", False),
    ("recurrent_ear_infections", "ear", "Frequent ear infections", "التهابات أذن متكررة", "child", True),
    ("nasal_blockage", "nose", "Blocked nose", "انسداد الأنف", "all", True),
    ("sneezing", "nose", "Frequent sneezing or runny nose", "عطس متكرر أو رشح", "all", False),
    ("nosebleeds", "nose", "Nosebleeds", "نزيف من الأنف", "all", True),
    ("smell_loss", "nose", "Reduced sense of smell", "ضعف حاسة الشم", "adult", False),
    ("snoring", "nose", "Snoring", "شخير", "all", False),
    ("mouth_breathing", "nose", "Breathing through the mouth while asleep", "التنفس من الفم أثناء النوم", "child", False),
    ("sore_throat", "throat", "Recurrent sore throat", "التهاب حلق متكرر", "all", False),
    ("hoarseness", "throat", "Hoarse voice", "بحة في الصوت", "all", False),
    ("swallowing", "throat", "Difficulty swallowing", "صعوبة في البلع", "all", False),
    ("reflux", "throat", "Heartburn or acid reflux", "حرقة أو ارتجاع", "adult", False),
    ("diabetes", "chronic", "Diabetes", "السكري", "all", False),
    ("hypertension", "chronic", "High blood pressure", "ضغط الدم المرتفع", "adult", False),
    ("asthma", "chronic", "Asthma", "الربو (حساسية الصدر)", "all", False),
    ("heart_disease", "chronic", "Heart disease", "أمراض القلب", "adult", False),
    ("bleeding_disorder", "chronic", "Bleeding or clotting problem", "مشكلة في النزيف أو التجلط", "all", False),
    ("thyroid", "chronic", "Thyroid disease", "أمراض الغدة الدرقية", "adult", False),
    ("tonsillectomy", "surgery", "Tonsil removal", "استئصال اللوز", "all", False),
    ("adenoidectomy", "surgery", "Adenoid removal", "استئصال اللحمية", "all", False),
    ("nasal_surgery", "surgery", "Nose or sinus surgery", "عملية في الأنف أو الجيوب", "all", False),
    ("ear_surgery", "surgery", "Ear surgery", "عملية في الأذن", "all", True),
    ("family_hearing_loss", "family", "Hearing loss in the family", "ضعف سمع في العائلة", "all", False),
    ("family_allergy", "family", "Allergies in the family", "حساسية في العائلة", "all", False),
    ("smoking", "habits", "Smoking", "التدخين", "adult", False),
    ("secondhand_smoke", "habits", "Smoking at home", "تدخين داخل المنزل", "child", False),
]

# (brand, generic, name_ar, form, strengths, route, drug_class)
MEDICATIONS = [
    ("Augmentin", "Amoxicillin + Clavulanic acid", "أوجمنتين", "tablet", ["375 mg", "625 mg", "1 g"], "oral", "Antibiotic"),
    ("Amoxil", "Amoxicillin", "أموكسيل", "capsule", ["250 mg", "500 mg"], "oral", "Antibiotic"),
    ("Zithromax", "Azithromycin", "زيثروماكس", "tablet", ["250 mg", "500 mg"], "oral", "Antibiotic"),
    ("Ciprobay", "Ciprofloxacin", "سيبروباي", "tablet", ["250 mg", "500 mg"], "oral", "Antibiotic"),
    ("Panadol", "Paracetamol", "بنادول", "tablet", ["500 mg"], "oral", "Analgesic"),
    ("Brufen", "Ibuprofen", "بروفين", "tablet", ["200 mg", "400 mg", "600 mg"], "oral", "NSAID"),
    ("Cataflam", "Diclofenac potassium", "كتافلام", "tablet", ["25 mg", "50 mg"], "oral", "NSAID"),
    ("Aspirin", "Acetylsalicylic acid", "أسبرين", "tablet", ["75 mg", "100 mg"], "oral", "Antiplatelet"),
    ("Claritine", "Loratadine", "كلاريتين", "tablet", ["10 mg"], "oral", "Antihistamine"),
    ("Zyrtec", "Cetirizine", "زيرتك", "tablet", ["10 mg"], "oral", "Antihistamine"),
    ("Otrivin", "Xylometazoline", "أوتريفين", "nasal spray", ["0.05%", "0.1%"], "nasal", "Decongestant"),
    ("Nasonex", "Mometasone furoate", "نازونكس", "nasal spray", ["50 mcg/dose"], "nasal", "Nasal steroid"),
    ("Avamys", "Fluticasone furoate", "أفاميس", "nasal spray", ["27.5 mcg/dose"], "nasal", "Nasal steroid"),
    ("Betaserc", "Betahistine", "بيتاسيرك", "tablet", ["8 mg", "16 mg", "24 mg"], "oral", "Anti-vertigo"),
    ("Ciprodex", "Ciprofloxacin + Dexamethasone", "سيبروديكس", "ear drops", ["0.3% / 0.1%"], "ear", "Ear drops"),
    ("Nexium", "Esomeprazole", "نيكسيوم", "tablet", ["20 mg", "40 mg"], "oral", "Proton pump inhibitor"),
    ("Glucophage", "Metformin", "جلوكوفاج", "tablet", ["500 mg", "850 mg", "1000 mg"], "oral", "Antidiabetic"),
    ("Concor", "Bisoprolol", "كونكور", "tablet", ["2.5 mg", "5 mg", "10 mg"], "oral", "Beta blocker"),
    ("Marevan", "Warfarin", "ماريفان", "tablet", ["1 mg", "3 mg", "5 mg"], "oral", "Anticoagulant"),
    ("Ventolin", "Salbutamol", "فنتولين", "inhaler", ["100 mcg/dose"], "inhaled", "Bronchodilator"),
]


async def seed(db: AsyncSession) -> None:
    existing_codes = set((await db.execute(select(HistoryOption.code))).scalars().all())
    for order, (code, category, name_en, name_ar, applies_to, has_side) in enumerate(HISTORY):
        if code not in existing_codes:
            db.add(HistoryOption(code=code, category=category, name_en=name_en, name_ar=name_ar, sort_order=order, applies_to=applies_to, has_side=has_side))

    existing_brands = set((await db.execute(select(Medication.brand_name))).scalars().all())
    for brand, generic, name_ar, form, strengths, route, drug_class in MEDICATIONS:
        if brand not in existing_brands:
            db.add(Medication(brand_name=brand, generic_name=generic, name_ar=name_ar, form=form, strengths=strengths, route=route, drug_class=drug_class))

    await db.commit()
    print(f"Catalog ready: {len(HISTORY)} history options, {len(MEDICATIONS)} medications (placeholders).")
