from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENWEATHERMAP_API_KEY = os.getenv("OPENWEATHERMAP_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

@app.get("/api/weather/{city}")
async def get_weather(city: str):
    if not OPENWEATHERMAP_API_KEY:
        raise HTTPException(status_code=500, detail="Weather API key not configured")

    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={OPENWEATHERMAP_API_KEY}&units=metric"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        return response.json()

@app.get("/api/weather/coords/{lat}/{lon}")
async def get_weather_coords(lat: float, lon: float):
    if not OPENWEATHERMAP_API_KEY:
        raise HTTPException(status_code=500, detail="Weather API key not configured")

    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHERMAP_API_KEY}&units=metric"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        return response.json()

@app.get("/api/forecast/coords/{lat}/{lon}")
async def get_forecast_coords(lat: float, lon: float):
    if not OPENWEATHERMAP_API_KEY:
        raise HTTPException(status_code=500, detail="Weather API key not configured")

    url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={OPENWEATHERMAP_API_KEY}&units=metric"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        return response.json()

@app.get("/api/geo/{city}")
async def get_geo(city: str):
    if not OPENWEATHERMAP_API_KEY:
        raise HTTPException(status_code=500, detail="Weather API key not configured")

    url = f"https://api.openweathermap.org/geo/1.0/direct?q={city}&limit=1&appid={OPENWEATHERMAP_API_KEY}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        return response.json()

@app.post("/api/chat")
async def chat(request: Request):
    if not OPENROUTER_API_KEY:
        raise HTTPException(status_code=500, detail="OpenRouter API key not configured")

    body = await request.json()
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers, json=body)
        return response.json()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
