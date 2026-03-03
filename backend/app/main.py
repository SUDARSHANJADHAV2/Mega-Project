import warnings
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from groq import Groq

warnings.filterwarnings('ignore')
load_dotenv()

# Setup Database
from app import models
from app.database import engine
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
from app.routers import auth, predict, ledger, market

app.include_router(auth.router)
app.include_router(predict.router)
app.include_router(ledger.router)
app.include_router(market.router)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Welcome to KrushiAI Unified Backend API V2"}

from app.schemas import ChatRequest

@app.post("/api/chatbot")
async def handle_chatbot(req: ChatRequest):
    """
    Real LLM responder using Groq API (Llama-3) for zero-cost, high-speed inference.
    """
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key or groq_api_key == "gsk_your_free_groq_api_key_here":
        return {"reply": "Configuration Error: Please add your free GROQ_API_KEY to the backend/.env file to enable the real AI assistant!"}

    try:
        client = Groq(api_key=groq_api_key)
        system_prompt = "You are KrushiAI, an expert Indian agricultural advisor. Provide short, practical, and highly accurate farming advice regarding crops, setup, market prices, and soil health. Do not hallucinate."
        
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": req.message,
                }
            ],
            model="llama3-8b-8192",
            max_tokens=256,
        )
        
        reply = chat_completion.choices[0].message.content
        return {"reply": reply}
    except Exception as e:
        return {"reply": f"AI Engine Error: {str(e)}"}

from app.schemas import MarketPriceRequest

@app.post("/api/market-prices")
async def get_market_prices(req: MarketPriceRequest):
    """
    Mock endpoint generating simulated live market price metrics for a given crop.
    """
    import random
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
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

