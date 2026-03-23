import warnings
import os
import random
import traceback

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from google import genai
from google.genai import types
from groq import Groq
import uvicorn

from app import models
from app.database import engine
from app.routers import auth, predict, ledger, market, satellite, tools_ocr, forecast, audio, environment, financial, health, education, ml_ops
from app.schemas import ChatRequest, MarketPriceRequest
from app.core.config import key_rotator
from app.core.model_manager import ensure_models_downloaded

warnings.filterwarnings('ignore')
load_dotenv()

# Setup Database
models.Base.metadata.create_all(bind=engine)

# Ensure models are checked
BASE_MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')
ensure_models_downloaded(BASE_MODEL_DIR)

app = FastAPI(title="KrushiAI Unified Backend API V2")

# Setup CORS to allow React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROUTERS ---
app.include_router(auth.router)
app.include_router(predict.router)
app.include_router(ledger.router)
app.include_router(market.router)
app.include_router(satellite.router)
app.include_router(tools_ocr.router)
app.include_router(forecast.router)
app.include_router(audio.router)
app.include_router(environment.router)
app.include_router(financial.router)
app.include_router(health.router)
app.include_router(education.router)
app.include_router(ml_ops.router)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Welcome to KrushiAI Unified Backend API V2"}

@app.post("/api/chatbot")
async def handle_chatbot(req: ChatRequest):
    """
    Real LLM responder using Gemini API (with key rotation) and Groq fallback.
    """
    system_prompt = "You are KrushiAI, an expert Indian agricultural advisor. Provide short, practical, and highly accurate farming advice regarding crops, setup, market prices, and soil health. Answer in the same language the user speaks. Do not hallucinate."
    
    # Try Gemini n times based on available keys
    for attempt in range(max(1, len(key_rotator.keys))):
        gemini_api_key = key_rotator.get_current_key()
        if gemini_api_key:
            try:
                client = genai.Client(api_key=gemini_api_key)
                config = types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    max_output_tokens=2048
                )
                response = client.models.generate_content(
                    model='gemini-2.0-flash',
                    contents=req.message,
                    config=config
                )
                return {"reply": response.text, "source": "gemini"}
            except Exception as e:
                err_str = str(e)
                if "429" in err_str or "403" in err_str or "401" in err_str:
                    key_rotator.rotate_key()
                    continue
                else:
                    return {"reply": f"Gemini Error: {err_str}"}
        else:
            break
            
    # Fallback to Groq
    groq_key = key_rotator.get_groq_key()
    if groq_key:
        try:
            client = Groq(api_key=groq_key)
            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": req.message}
                ],
                temperature=0.5,
                max_tokens=2048,
            )
            return {"reply": completion.choices[0].message.content, "source": "groq"}
        except Exception as e:
            return {"reply": f"Groq Fallback Error: {str(e)}"}
            
    # Tertiary Fallback to Offline FAQ logic
    return {"reply": "All AI models are temporarily unavailable. Please refer to the offline FAQ.", "source": "offline_faq"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
