from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/health", tags=["Farmer Health, Safety & Legal"])

# --- Feature H1: Pesticide Chemical Exposure Risk Calculator ---
@router.get("/pesticide-risk")
def get_pesticide_risk(chemical: str, hours_exposed_per_week: float):
    chem_lower = chemical.lower()
    
    # Red & Yellow label toxicity heuristics
    high_toxicity = ["monocrotophos", "paraquat", "phorate", "chlorpyrifos", "methomyl", "endosulfan"]
    moderate_toxicity = ["cypermethrin", "imidacloprid", "mancozeb"]
    
    risk_level = "Low/Green Label"
    toxicity_score = 1
    symptoms = ["Mild skin irritation", "Headache"]
    ppe = ["Basic mask", "Long sleeves", "Gloves"]
    
    if any(tox in chem_lower for tox in high_toxicity):
        toxicity_score = 5
        risk_level = "CRITICAL / RED LABEL (Extremely Toxic)"
        symptoms = ["Nausea", "Dizziness", "Blurred Vision", "Muscle Tremors", "Respiratory Failure"]
        ppe = ["N95/Respirator Mask", "Chemical Resistant Suit", "Nitrile Gloves", "Goggles", "Rubber Boots"]
    elif any(tox in chem_lower for tox in moderate_toxicity):
        toxicity_score = 3
        risk_level = "MODERATE / YELLOW LABEL (Highly Toxic)"
        symptoms = ["Vomiting", "Eye Irritation", "Weakness"]
        ppe = ["Surgical/N95 Mask", "Goggles", "Rubber Gloves", "Full Clothing"]

    exposure_multiplier = hours_exposed_per_week / 15.0
    total_risk = min(10.0, toxicity_score * exposure_multiplier * 2.5)
    
    return {
        "chemical_analyzed": chemical,
        "hazard_classification": risk_level,
        "cumulative_risk_score_1_to_10": round(total_risk, 1),
        "mandatory_ppe_requirements": ppe,
        "acute_symptoms_to_monitor": symptoms,
        "first_aid": "If swallowed/inhaled, DO NOT induce vomiting for red labels. Rush to hospital with the chemical bottle. If on skin, wash continuously for 15 minutes." if toxicity_score > 3 else "Wash hands thoroughly with soap."
    }

# --- Feature H3: First Aid Protocol Generator ---
@router.get("/first-aid")
def get_first_aid(incident: str):
    protocols = {
        "snakebite": [
            "Keep the patient absolutely calm and restrict movement to slow venom.",
            "Do NOT cut the wound, attempt to suck venom, or use a tight tourniquet.",
            "Remove any tight jewelry or clothing near the bite.",
            "Note the snake's color/shape if safely possible.",
            "Transport immediately to a Primary Health Center (PHC) equipped with Anti-Snake Venom (ASV)."
        ],
        "sunstroke": [
            "Move the person to a shaded, cool environment immediately.",
            "Elevate feet slightly to improve blood flow to the brain.",
            "Remove excess clothing and sponge skin with cold water.",
            "Provide Oral Rehydration Solution (ORS) slowly if conscious.",
            "If confused or unconscious, call an ambulance immediately."
        ],
        "chemical_burn": [
            "Flush the affected skin or eyes with continuous, clean running water for 20 minutes.",
            "Do NOT rub the area.",
            "Remove contaminated clothing while flushing.",
            "Do NOT apply ointments, oils, or turmeric to the chemical burn.",
            "Seek medical attention and bring the chemical container."
        ]
    }
    
    key = incident.lower().replace(" ", "_")
    
    return {
        "incident_type": incident,
        "immediate_action_steps": protocols.get(key, ["Call National Ambulance Emergency Number (108).", "Ensure scene is safe for rescuers.", "Do not move the victim if spinal injury is suspected."]),
        "helpline": "108 (Ambulance), 104 (Health Helpline)"
    }

# --- Feature H4 & H6: Legal Advisory Bot ---
@router.get("/legal-advisory")
def get_legal_advisory(topic: str):
    topic_lower = topic.lower()
    advice = "Please consult a State Legal Services Authority advocate for free legal counsel."
    
    if "tenant" in topic_lower or "lease" in topic_lower:
        advice = ("Under most state laws, oral tenancy is not legally secure. To claim crop insurance, disaster relief, or credit, "
                 "you MUST execute a written lease agreement and ideally have it registered or noted by the village Patwari. "
                 "You are entitled to peaceful possession during the lease term.")
    elif "msp" in topic_lower or "procurement" in topic_lower:
        advice = ("MSP is an administrative price floor. In APMC (Mandis), auctions for notified crops must start at or above MSP. "
                 "If traders collude to buy below MSP, you can formally complain to the Mandi Secretary. "
                 "Consider selling via the e-NAM digital portal for transparent price discovery.")
    elif "land" in topic_lower or "boundary" in topic_lower or "dispute" in topic_lower:
        advice = ("Do not engage in physical altercations over boundaries. File an official application for 'Demarcation' (Nishandehi) "
                 "with the Tehsildar or Circle Officer. Gather your updated Khasra/Khatauni documents. "
                 "If encroached, file a civil suit for injunction under the Specific Relief Act.")
                 
    return {
        "topic": topic,
        "legal_position_summary": advice,
        "recommended_authority": "Revenue Department (Tehsildar) or Mandi Board",
        "free_legal_aid": "Contact District Legal Services Authority (DLSA) for free representation."
    }

# --- Feature H5: Mental Health & Stress Analyzer ---
class StressAudit(BaseModel):
    debt_burden: str # "low", "medium", "high"
    recent_crop_failure: bool
    sleep_hours: float
    social_isolation: bool

@router.post("/stress-audit")
def analyze_stress(data: StressAudit):
    score = 0
    if data.debt_burden.lower() == "high": score += 35
    elif data.debt_burden.lower() == "medium": score += 15
    if data.recent_crop_failure: score += 30
    if data.sleep_hours < 5.0: score += 20
    if data.social_isolation: score += 15
    
    category = "Healthy/Low Risk"
    action = "Continue maintaining healthy habits and community connections."
    
    if score >= 65:
        category = "CRITICAL RISK (Severe Distress)"
        action = ("Your stress markers indicate extreme duress affecting your physical and mental health. "
                 "Please call the free, anonymous 'KIRAN' Mental Health Helpline immediately at 1800-599-0019 or the 'Kisan Mitra' helpline. "
                 "Your life is infinitely more valuable than financial debt. Help is available.")
    elif score >= 40:
        category = "Moderate Risk (Elevated Stress)"
        action = ("You are carrying a heavy burden. Limit isolation, speak to family members about financial pressures openly, "
                 "and prioritize getting 7 hours of sleep. Consult local FPOs for debt restructuring advice.")
                 
    return {
        "stress_index_score": score,
        "clinical_risk_category": category,
        "immediate_recommendation": action
    }
