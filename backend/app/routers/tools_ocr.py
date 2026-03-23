from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import re

router = APIRouter(prefix="/api/tools", tags=["OCR and Document Tools"])

# --- O1: Soil Validate ---
class SoilValidateRequest(BaseModel):
    N: float
    P: float
    K: float
    pH: float

@router.post("/validate-soil-values")
def validate_soil(data: SoilValidateRequest):
    warnings = []
    if not (0 <= data.N <= 500): warnings.append("Nitrogen value is unusually high or low (Standard: 0-500 kg/ha).")
    if not (0 <= data.P <= 100): warnings.append("Phosphorus value out of standard range (Standard: 0-100 kg/ha).")
    if not (0 <= data.K <= 600): warnings.append("Potassium value out of standard range (Standard: 0-600 kg/ha).")
    if not (4.0 <= data.pH <= 9.5): warnings.append("pH is extreme, check for OCR misread. Indian soils typically 4.5-8.5.")
    return {"valid": len(warnings) == 0, "warnings": warnings}


# --- O2: Fertilizer Decode ---
class FertilizerRequest(BaseModel):
    extracted_text: str
    crop: str
    farm_size_acres: float

@router.post("/decode-fertilizer-label")
def decode_fertilizer(data: FertilizerRequest):
    grade = "Unknown"
    # Fallback regex parsing to extract NPK ratio like "12:32:16" or "18-46-0"
    matches = re.search(r'(\d{1,2})[\s:\-](\d{1,2})[\s:\-](\d{1,2})', data.extracted_text)
    if matches:
        grade = f"{matches.group(1)}:{matches.group(2)}:{matches.group(3)}"
    elif "Urea" in data.extracted_text or "46%" in data.extracted_text:
        grade = "46:0:0"
    
    return {
        "fertilizer_name": "Generic NPK Fertilizer" if grade != "Unknown" else "Unrecognized Label",
        "npk_grade": grade,
        "application_rate_kg_per_acre": 50.0, # Heuristic standard bag
        "total_quantity_needed_kg": 50.0 * data.farm_size_acres,
        "cost_estimate_inr": 1350.0 * data.farm_size_acres,
        "warnings": ["Please visually confirm the N-P-K grade. Machine vision may misread smudged labels."]
    }


# --- O3: Pesticide Safety Check ---
class PesticideRequest(BaseModel):
    active_ingredient: str
    state: str

@router.post("/pesticide-safety")
def pesticide_safety(data: PesticideRequest):
    banned_chemicals = ["endosulfan", "monocrotophos", "dicofol", "phorate"]
    status = "SAFE"
    who_class = "III"
    
    ingredient_lower = data.active_ingredient.lower()
    for ban in banned_chemicals:
        if ban in ingredient_lower:
            status = "BANNED"
            who_class = "Ib"
            break
            
    return {
        "safety_status": status,
        "who_class": who_class,
        "pests_controlled": ["Broad-spectrum" if status!="BANNED" else "N/A"],
        "phi_days": 15,
        "safe_harvest_date": "Calculate 15 days from spray",
        "ppe_required": ["Nitrile gloves", "Mask", "Coverall"] if status!="BANNED" else [],
        "emergency_contact": "1800-180-1551 (Kisan Call Center)"
    }


# --- O7: Contract Analyzer ---
class ContractRequest(BaseModel):
    extracted_text: str

@router.post("/analyze-contract")
def analyze_contract(data: ContractRequest):
    # Regex heuristic fallback for contract parsing (since Gemini is expensive/rate limited)
    red_flags = []
    text_lower = data.extracted_text.lower()
    
    if "penalty" in text_lower or "forfeit" in text_lower:
        red_flags.append("Penalty clause identified. Ensure it does not violate Contract Farming Act 2018.")
    if "minimum quantity" not in text_lower:
        red_flags.append("No clear minimum quantity commitment found.")
        
    return {
        "features": {
            "guaranteed_price": "Requires Manual Verification from text",
            "payment_timeline": "Requires Manual Verification",
            "duration": "Requires Manual Verification"
        },
        "red_flags": red_flags,
        "farmer_protection_score": 100 - (len(red_flags) * 20),
        "source": "Heuristic Local Analysis"
    }
