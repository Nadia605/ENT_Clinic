"""Fixed option lists used by the intake. Labels are bilingual; values are stable codes."""

ALLERGY_ANSWERS = ("yes", "no", "unsure")
HISTORY_ANSWERS = ("yes", "no", "unknown")
SIDES = ("right", "left", "both")

HISTORY_CATEGORIES = [
    {"code": "ear", "name_en": "Ear", "name_ar": "الأذن"},
    {"code": "nose", "name_en": "Nose & sinuses", "name_ar": "الأنف والجيوب الأنفية"},
    {"code": "throat", "name_en": "Throat & voice", "name_ar": "الحلق والصوت"},
    {"code": "chronic", "name_en": "Chronic conditions", "name_ar": "أمراض مزمنة"},
    {"code": "surgery", "name_en": "Previous surgeries", "name_ar": "عمليات سابقة"},
    {"code": "family", "name_en": "Family history", "name_ar": "تاريخ عائلي"},
    {"code": "habits", "name_en": "Habits", "name_ar": "عادات"},
]
ENT_CATEGORIES = ("ear", "nose", "throat")
OTHER_CATEGORIES = ("chronic", "surgery", "family", "habits")

ONSET = [
    {"code": "lt_1m", "name_en": "Less than a month", "name_ar": "أقل من شهر"},
    {"code": "1_6m", "name_en": "1–6 months", "name_ar": "من شهر إلى ٦ أشهر"},
    {"code": "6_12m", "name_en": "6–12 months", "name_ar": "من ٦ أشهر إلى سنة"},
    {"code": "gt_1y", "name_en": "More than a year", "name_ar": "أكثر من سنة"},
]

REACTIONS = [
    {"code": "rash", "name_en": "Skin rash", "name_ar": "طفح جلدي"},
    {"code": "itching", "name_en": "Itching", "name_ar": "حكة"},
    {"code": "swelling", "name_en": "Face or lip swelling", "name_ar": "تورم الوجه أو الشفاه"},
    {"code": "breathing", "name_en": "Breathing difficulty", "name_ar": "صعوبة في التنفس"},
    {"code": "anaphylaxis", "name_en": "Severe reaction (anaphylaxis)", "name_ar": "حساسية شديدة (صدمة تحسسية)"},
    {"code": "stomach", "name_en": "Nausea or stomach upset", "name_ar": "غثيان أو اضطراب في المعدة"},
    {"code": "unknown", "name_en": "I don't remember", "name_ar": "لا أتذكر"},
]

FREQUENCIES = [
    {"code": "once_daily", "name_en": "Once daily", "name_ar": "مرة يومياً"},
    {"code": "twice_daily", "name_en": "Twice daily", "name_ar": "مرتين يومياً"},
    {"code": "three_daily", "name_en": "Three times daily", "name_ar": "٣ مرات يومياً"},
    {"code": "as_needed", "name_en": "When needed", "name_ar": "عند الحاجة"},
    {"code": "weekly", "name_en": "Weekly", "name_ar": "أسبوعياً"},
]

MED_REVIEW = ("continue", "changed", "stopped")

REACTION_CODES = {r["code"] for r in REACTIONS}
FREQUENCY_CODES = {f["code"] for f in FREQUENCIES}
ONSET_CODES = {o["code"] for o in ONSET}
