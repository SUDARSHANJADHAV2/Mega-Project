from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/education", tags=["Education, Simulation & Intelligence"])

# --- Ed1: Interactive Soil Science Simulator ---
@router.get("/soil-simulator")
def soil_simulator(ph: float, nitrogen: float, moisture: float, crop: str = "wheat"):
    yield_multiplier = 1.0
    feedback = []
    
    # pH logic
    if ph < 5.5:
        yield_multiplier *= 0.7
        feedback.append("Soil is highly acidic. Phosphorus will be locked out. Add Agricultural Lime.")
    elif ph > 7.5:
        yield_multiplier *= 0.8
        feedback.append("Soil is too alkaline. Micronutrients like Iron and Zinc will be unavailable. Add Gypsum or organic matter.")
    else:
        yield_multiplier *= 1.1
        feedback.append("Ideal pH range for nutrient solubility.")
        
    # N logic
    if nitrogen < 30:
        yield_multiplier *= 0.6
        feedback.append("Severe Nitrogen deficiency. Expect stunted growth and yellowing (chlorosis).")
    elif nitrogen > 150:
        yield_multiplier *= 0.8
        feedback.append("Excess Nitrogen. Plants will be highly susceptible to lodging and pest attacks. Stop fertilization immediately.")
        
    # Moisture
    if moisture < 20:
        yield_multiplier *= 0.5
        feedback.append("Critical Drought Stress. Turgor pressure lost. Irrigate immediately.")
        
    return {
        "crop_profile": crop,
        "simulated_yield_capacity_percent": round(yield_multiplier * 100, 1),
        "agronomic_feedback": feedback
    }

# --- Ed2: Pest Evolution Timeline Viewer ---
@router.get("/pest-lifecycle")
def get_pest_lifecycle(pest_name: str):
    pest_data = {
        "fall_armyworm": {
            "egg": {"days": 3, "vulnerability": "High", "control": "Trichogramma wasps / Neem Oil"},
            "larvae": {"days": 14, "vulnerability": "Medium", "control": "Spinosad / Emamectin Benzoate (Act during early instars)"},
            "pupa": {"days": 9, "vulnerability": "Low", "control": "Deep ploughing to expose pupae to birds/heat"},
            "adult": {"days": 10, "vulnerability": "Medium", "control": "Pheromone traps to disrupt mating"}
        }
    }
    
    key = "fall_armyworm" # Mapped by default for demo
    
    return {
        "pest": "Fall Armyworm (Spodoptera frugiperda)",
        "total_lifecycle_days": 36,
        "stages": pest_data[key],
        "key_learning": "Target the larvae stage in the first 3 days (Instars 1-2) before they bore deeply into the whorl."
    }

# --- Ed3: Climate Change Yield Impact Simulator ---
@router.get("/climate-simulator")
def climate_simulator(crop: str, temp_increase_celsius: float):
    impact = 0
    if temp_increase_celsius > 1.5:
        impact = -15
    if temp_increase_celsius > 2.5:
        impact = -35
        
    if crop.lower() in ["millet", "jowar", "sorghum"]:
        impact = impact / 2 # Hardier crops
        
    return {
        "scenario": f"+{temp_increase_celsius}°C Global Average Rise",
        "predicted_yield_impact_percent": impact,
        "adaptation_strategy": "Shift sowing dates backward by 15 days or adopt short-duration heat-tolerant varieties like PBW-803.",
        "carbon_feedback_loop": "Higher temperatures accelerate soil organic carbon decomposition."
    }

# --- Ed5: Gamified Best Practices Quiz Generator ---
@router.get("/generate-quiz")
def generate_quiz(topic: str = "General Agriculture"):
    return {
        "topic": topic,
        "questions": [
            {
                "id": 1,
                "question": "Which microorganism fixing nitrogen perfectly pairs with pulse crop roots?",
                "options": ["Azotobacter", "Rhizobium", "Mycorrhizae", "Trichoderma"],
                "correct_index": 1,
                "explanation": "Rhizobium forms nodules on the roots of legumes (pulses) physically capturing atmospheric nitrogen."
            },
            {
                "id": 2,
                "question": "What does a sudden drop in barometric pressure indicate for a farmer?",
                "options": ["Excellent harvest weather", "High pest activity", "Approaching storm or cyclone", "Soil compaction"],
                "correct_index": 2,
                "explanation": "Rapidly falling pressure almost universally indicates a severe incoming storm system."
            }
        ]
    }
