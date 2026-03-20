import warnings
import os
import random

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import google.generativeai as genai
import uvicorn

from app import models
from app.database import engine
from app.routers import auth, predict, ledger, market
from app.schemas import ChatRequest, MarketPriceRequest

warnings.filterwarnings('ignore')
load_dotenv()

# Setup Database
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="KrushiAI Unified Backend API V2")

# Setup CORS to allow React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5175", "http://127.0.0.1:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROUTERS ---
app.include_router(auth.router)
app.include_router(predict.router)
app.include_router(ledger.router)
app.include_router(market.router)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Welcome to KrushiAI Unified Backend API V2"}

@app.post("/api/chatbot")
async def handle_chatbot(req: ChatRequest):
    """
    Real LLM responder using Gemini API for zero-cost, high-speed inference.
    """
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        return {"reply": "Configuration Error: Please add your free GEMINI_API_KEY to the backend/.env file to enable the real AI assistant!"}

    try:
        genai.configure(api_key=gemini_api_key)
        system_prompt = "You are KrushiAI, an expert Indian agricultural advisor. Provide short, practical, and highly accurate farming advice regarding crops, setup, market prices, and soil health. Do not hallucinate."
        model = genai.GenerativeModel('gemini-1.5-flash', system_instruction=system_prompt)
        
        response = model.generate_content(
            req.message,
            generation_config=genai.types.GenerationConfig(max_output_tokens=2048)
        )
        
        reply = response.text
        return {"reply": reply}
    except Exception as e:
        return {"reply": f"AI Engine Error: {str(e)}"}

@app.post("/api/market-prices")
async def get_market_prices(req: MarketPriceRequest):
    """
    Mock endpoint generating simulated live market price metrics for a given crop.
    """
    base_price = random.randint(1000, 3000)
    trend = random.choice(["up", "down", "stable"])
    change_pct = round(random.uniform(0.5, 5.0), 2)
    
    return {
        "crop": req.crop,
        "current_price_per_quintal": base_price,
        "trend": trend,
        "change_percentage": change_pct,
        "demand_forecast": random.choice(["High", "Moderate", "Average"])
    }

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)

