from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/environment", tags=["Environmental & Sustainability"])

# --- Feature E1: Water Footprint Calculator ---
@router.get("/water-footprint")
def get_water_footprint(crop: str, yield_kg: float):
    # Liters of water required per kg of crop (Heuristics based on Indian Agri data)
    crop_lower = crop.lower()
    intensity = 1500 # default
    if "rice" in crop_lower or "paddy" in crop_lower: intensity = 2500
    elif "wheat" in crop_lower: intensity = 1200
    elif "cotton" in crop_lower: intensity = 2250
    elif "sugarcane" in crop_lower: intensity = 1800
    elif "millet" in crop_lower or "jowar" in crop_lower: intensity = 350
    elif "maize" in crop_lower: intensity = 900
    
    total_liters = yield_kg * intensity
    footprint_score = max(0, 100 - (intensity / 3000 * 100))
    
    return {
        "crop": crop,
        "water_intensity_liters_per_kg": intensity,
        "total_water_footprint_liters": total_liters,
        "sustainability_score_1_to_100": round(footprint_score, 1),
        "comparison_to_average": "High Water Consumption" if intensity > 1500 else "Water Efficient",
        "recommendation": "Switching to Sub-Surface Drip Irrigation (SDI) can reduce this footprint by 40%."
    }

# --- Feature E2 & E3: Carbon Sequestration & Organic Profit Comparison ---
class FarmProfile(BaseModel):
    crop: str
    acres: float
    farming_type: str # "chemical", "organic", "regenerative"

@router.post("/sustainability-audit")
def sustainability_audit(data: FarmProfile):
    type_lower = data.farming_type.lower()
    
    # Soil Carbon Metrics
    tco2_factor = 0.1
    if type_lower == "organic": tco2_factor = 0.6
    elif type_lower == "regenerative": tco2_factor = 1.2
    
    seq_tco2 = tco2_factor * data.acres
    carbon_revenue = seq_tco2 * 650 # INR 650 per tCO2 standard voluntary market proxy
    
    # Economics (Per Acre Proxy Models)
    chem_cost = 18000
    org_cost = 9500
    base_yield_revenue = 45000
    
    profit_chem = (base_yield_revenue - chem_cost) * data.acres
    profit_org = ((base_yield_revenue * 1.3) - org_cost) * data.acres # 30% organic premium
    
    return {
        "carbon_credits_earned_tco2": round(seq_tco2, 2),
        "potential_carbon_revenue_inr": round(carbon_revenue, 2),
        "soil_health_trajectory": "Improving" if type_lower != "chemical" else "Degrading / Stagnant",
        "comparative_economics": {
            "projected_profit_current_method": profit_chem if type_lower == "chemical" else profit_org,
            "projected_profit_alternative_method": profit_org if type_lower == "chemical" else profit_chem,
            "alternative_method_name": "Organic" if type_lower == "chemical" else "Chemical",
        },
        "premium_market_eligibility": type_lower != "chemical"
    }

# --- Feature E4: Crop Rotation Recommender ---
@router.get("/crop-rotation")
def crop_rotation(current_crop: str, soil_type: str = "Black"):
    return {
        "current_crop": current_crop,
        "recommended_next_crop": "Legumes (Chickpea/Moong)",
        "alternative_crop": "Mustard",
        "nitrogen_fixed_kg_per_acre": 15.5,
        "pest_cycle_broken": True,
        "disease_suppression_rating": "High",
        "soil_biome_benefit": "Increases Rhizobium bacteria count naturally."
    }

# --- Feature E5: Solar Pump ROI Calculator ---
@router.get("/solar-roi")
def solar_roi(diesel_liters_per_month: float, pump_hp: int):
    # 1 liter diesel = 2.68 kg CO2
    diesel_price = 94.50
    monthly_fuel_cost = diesel_liters_per_month * diesel_price
    
    # PM KUSUM Subsidy Proxy - assuming 60% subsidy mapping
    gross_solar_cost = pump_hp * 90000 
    net_farmer_share = gross_solar_cost * 0.40
    
    months_to_recover = net_farmer_share / monthly_fuel_cost if monthly_fuel_cost > 0 else 0
    
    return {
        "current_monthly_diesel_cost_inr": round(monthly_fuel_cost, 2),
        "gross_solar_system_cost_inr": gross_solar_cost,
        "net_cost_after_pm_kusum_subsidy_inr": net_farmer_share,
        "break_even_time_months": round(months_to_recover, 1),
        "co2_emissions_saved_kg_per_year": round(diesel_liters_per_month * 12 * 2.68, 1),
        "recommendation": "High ROI. Apply for PM-KUSUM component B immediately." if months_to_recover < 36 else "Moderate ROI. Wait for better state subsidies."
    }
