from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/audio", tags=["Audio & Voice Intelligence"])

# --- Feature A1: Voice to Field Log Parsing ---
class VoiceLogRequest(BaseModel):
    transcript: str

@router.post("/parse-log")
def parse_voice_log(data: VoiceLogRequest):
    # Heuristic fallback for Natural Language parser
    text = data.transcript.lower()
    action = "Observation"
    if "spray" in text or "fertilizer" in text or "applied" in text:
        action = "Chemical Application"
    elif "harvest" in text:
        action = "Harvesting"
    elif "sow" in text or "seed" in text:
        action = "Sowing"
        
    urgency = "High" if any(word in text for word in ["urgent", "destroy", "dying", "emergency"]) else "Normal"
    
    return {
        "parsed_log": {
            "action": action,
            "crop": "Auto-Detect From Context",
            "date": "Today",
            "urgency": urgency
        },
        "suggested_next_steps": ["Update ledger inventory", "Schedule follow-up reminder"],
        "source": "Heuristic Regex Parser"
    }

# --- Feature A2: Audio Pest Description (STT mapped to RAG) ---
class PestQueryRequest(BaseModel):
    transcript: str

@router.post("/pest-query")
def pest_query(data: PestQueryRequest):
    text = data.transcript.lower()
    disease = "Unidentified Issue"
    treatment = "Please provide more details or upload an image."
    
    # Basic keyword RAG simulation
    if "yellow" in text and "leaf" in text:
        disease = "Yellow Vein Mosaic Virus / Nutrient Deficiency"
        treatment = "Apply Nitrogenous fertilizer or spray Neem oil for vectors."
    elif "white" in text and ("bug" in text or "fly" in text):
        disease = "Whitefly Infestation"
        treatment = "Use Yellow Sticky Traps and apply Imidacloprid."
    elif "worm" in text or "hole" in text:
        disease = "Bollworm / Armyworm"
        treatment = "Apply Spinosad or Emamectin Benzoate during evening hours."
        
    return {
        "identified_issue": disease,
        "confidence_score": 0.82 if disease != "Unidentified Issue" else 0.4,
        "treatment_recommendation": treatment
    }

# --- Feature A4: Podcast/Daily Agri-Briefing Generator ---
@router.get("/daily-briefing")
def generate_briefing(lang: str = "en"):
    # Generate dynamic script for the Web Speech API to read aloud as a "Podcast"
    briefing_en = "Good morning. Here is your KrushiA.I. daily farm briefing. Wheat prices are up by two percent at the local mandi. The weather today will be sunny with a high of 32 degrees celsius. Soil moisture levels remain optimal. There are no immediate weather alerts for your region. Have a productive day on the farm."
    briefing_hi = "सुप्रभात। यहाँ आपकी कृषि एआई दैनिक ब्रीफिंग है। स्थानीय मंडी में गेहूं की कीमतों में दो प्रतिशत की वृद्धि हुई है। आज मौसम 32 डिग्री सेल्सियस के उच्च तापमान के साथ धूप वाला रहेगा। मिट्टी में नमी का स्तर इष्टतम बना हुआ है। आपके क्षेत्र के लिए तत्काल कोई मौसम चेतावनी नहीं है। खेत पर आपका दिन मंगलमय हो।"
    
    text = briefing_hi if lang == "hi" else briefing_en
    voice_lang = "hi-IN" if lang == "hi" else "en-IN"
    
    return {
        "briefing_script": text,
        "recommended_voice_lang": voice_lang,
        "duration_estimate_seconds": 25,
        "segments": ["Market", "Weather", "Soil", "Alerts"]
    }
