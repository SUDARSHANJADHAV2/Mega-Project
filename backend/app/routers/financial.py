from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/financial", tags=["Financial & Fintech Intelligence"])

# --- Feature F1: Loan EMI Calculator ---
@router.get("/emi")
def calculate_emi(principal: float, rate_annual_percent: float, tenure_months: int):
    r = rate_annual_percent / (12 * 100)
    if r == 0:
        emi = principal / tenure_months
    else:
        emi = principal * r * ((1 + r)**tenure_months) / (((1 + r)**tenure_months) - 1)
        
    return {
        "principal": principal,
        "monthly_emi": round(emi, 2),
        "total_interest_paid": round((emi * tenure_months) - principal, 2),
        "total_amount_paid": round(emi * tenure_months, 2),
        "kcc_interest_subvention_eligible": principal <= 300000,
        "kcc_effective_rate_if_prompt": 4.0 if principal <= 300000 else rate_annual_percent
    }

# --- Feature F3: Micro-Insurance Premium (PMFBY Estimator) ---
@router.get("/insurance-premium")
def get_insurance_premium(crop: str, sum_insured_per_acre: float, acres: float):
    # Kharif = 2%, Rabi = 1.5%, Commercial/Horticulture = 5% 
    rate = 2.0
    season = "Kharif"
    crop_lower = crop.lower()
    
    if crop_lower in ["wheat", "mustard", "chickpea", "barley", "peas"]:
        rate = 1.5
        season = "Rabi"
    elif crop_lower in ["cotton", "sugarcane", "banana", "onion", "potato", "mango"]:
        rate = 5.0
        season = "Commercial/Horticulture"
        
    total_sum_insured = sum_insured_per_acre * acres
    premium = total_sum_insured * (rate / 100.0)
    
    return {
        "crop": crop,
        "season_type": season,
        "farmer_premium_rate_percent": rate,
        "total_sum_insured_inr": total_sum_insured,
        "estimated_farmer_premium_inr": premium,
        "government_subsidy_share": "Balance Actuarial Premium completely funded equally by State & Central Govt",
        "deadline_warning": f"Ensure enrollment before the {season} PMFBY cutoff date."
    }

# --- Feature F5: Export Potential & Forex Tracker ---
@router.get("/export-forex")
def get_forex_tracker(commodity: str, quantity_tons: float):
    # Mock Market API integration logic
    usd_inr = 83.25
    usd_price_per_ton = 650.0  # e.g., Basmati Rice baseline
    if "cotton" in commodity.lower(): usd_price_per_ton = 1850.0
    if "wheat" in commodity.lower(): usd_price_per_ton = 290.0
    if "spices" in commodity.lower(): usd_price_per_ton = 4500.0
    
    total_usd = quantity_tons * usd_price_per_ton
    inr_revenue = total_usd * usd_inr
    
    return {
        "commodity": commodity,
        "current_usd_inr_rate": usd_inr,
        "export_price_usd_per_ton": usd_price_per_ton,
        "realization_in_usd": round(total_usd, 2),
        "projected_gross_export_revenue_inr": round(inr_revenue, 2),
        "domestic_equivalence_inr": round(inr_revenue * 0.85, 2), # 15% export premium assumed
        "export_premium_advantage_percent": 15.0
    }

# --- Feature F6: Subsidy Eligibility Screener ---
class SubsidyRequest(BaseModel):
    category: str # "small", "marginal", "other"
    gender: str
    state: str
    equipment_type: str

@router.post("/subsidy-eligibility")
def check_subsidy(data: SubsidyRequest):
    subsidies = []
    
    sub_pct = 40
    if data.gender.lower() == "female" or data.category in ["small", "marginal"]:
        sub_pct = 50
        
    if data.equipment_type.lower() in ["tractor", "rotavator", "harvester"]:
        subsidies.append(f"SMAM Scheme: Eligible for {sub_pct}% subsidy on total machinery cost.")
        
    if data.equipment_type.lower() == "drone":
         subsidies.append("Kisan Drone Scheme: FPOs eligible for up to 100% grant (max Rs. 10 Lakhs). Individual SC/ST/Women/Small farmers at 50%.")
         
    if data.equipment_type.lower() == "solar_pump":
         subsidies.append("PM-KUSUM Component B: Eligible for 60% standard subsidy (30% Center + 30% State).")
         
    if not subsidies:
         subsidies.append("No specific high-value equipment subsidies found for this tier. Check generic state agriculture portals.")
         
    return {
        "eligible_schemes": subsidies,
        "recommended_portal_application": "https://agrimachinery.nic.in/"
    }

# --- Feature F7: FPO Group Buying Simulator ---
@router.get("/fpo-savings")
def group_buying(input_type: str, qty_individual: float, fpo_size: int):
    retail_price = 1350.0 # DAP proxy
    wholesale_price = 1120.0 # Bulk rate
    
    individual_cost = qty_individual * retail_price
    fpo_unit_cost = qty_individual * wholesale_price
    savings = individual_cost - fpo_unit_cost
    
    return {
        "input": input_type,
        "individual_retail_cost_inr": individual_cost,
        "fpo_wholesale_unit_cost_inr": fpo_unit_cost,
        "direct_savings_per_farmer_inr": savings,
        "collective_fpo_order_value_inr": fpo_unit_cost * fpo_size,
        "volume_discount_achieved_percent": round(((retail_price - wholesale_price) / retail_price) * 100, 1),
        "syndicate_strength": f"{fpo_size} Farmers aggregated."
    }
