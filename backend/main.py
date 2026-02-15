from fastapi import FastAPI, HTTPException, Request, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
import httpx
import os
from dotenv import load_dotenv
from typing import Optional

try:
    from .database import get_db, User
except ImportError:
    from database import get_db, User

load_dotenv()

# Security Config
SECRET_KEY = os.getenv("JWT_SECRET", "super-secret-krushiai-key-change-me-in-prod")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 1 day

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

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

# --- Auth Helpers ---

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- Auth Endpoints ---

@app.post("/api/register")
async def register(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    email = data.get("email")
    password = data.get("password")
    full_name = data.get("full_name")
    phone = data.get("phone")

    if not email and not phone:
         raise HTTPException(status_code=400, detail="Email or Phone is required")

    # Check if user exists
    user_exists = db.query(User).filter((User.email == email) | (User.phone == phone)).first()
    if user_exists:
        raise HTTPException(status_code=400, detail="User already registered")

    hashed_pw = get_password_hash(password) if password else None
    new_user = User(
        email=email,
        phone=phone,
        full_name=full_name,
        hashed_password=hashed_pw,
        provider="local"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully"}

@app.post("/api/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer", "full_name": user.full_name}

@app.post("/api/auth/google")
async def google_auth(request: Request, db: Session = Depends(get_db)):
    # Mock Google Auth - in real app, verify ID token from Google
    data = await request.json()
    email = data.get("email")
    full_name = data.get("full_name")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(email=email, full_name=full_name, provider="google")
        db.add(user)
        db.commit()
        db.refresh(user)

    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer", "full_name": user.full_name}

@app.post("/api/auth/phone")
async def phone_auth(request: Request, db: Session = Depends(get_db)):
    # Mock Phone Auth - in real app, verify OTP
    data = await request.json()
    phone = data.get("phone")
    full_name = data.get("full_name", "Phone User")

    user = db.query(User).filter(User.phone == phone).first()
    if not user:
        user = User(phone=phone, full_name=full_name, provider="phone")
        db.add(user)
        db.commit()
        db.refresh(user)

    access_token = create_access_token(data={"sub": f"phone_{phone}"})
    return {"access_token": access_token, "token_type": "bearer", "full_name": user.full_name}

# --- Existing Endpoints ---

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
