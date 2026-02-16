"""
KrushiAI Backend API
FastAPI-based backend providing authentication, weather data, chat proxy,
and prediction logging endpoints.
"""

from fastapi import FastAPI, HTTPException, Request, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from pydantic import BaseModel, EmailStr, Field
import httpx
import os
import logging
from dotenv import load_dotenv
from typing import Optional

try:
    from .database import get_db, User, PredictionLog
except ImportError:
    from database import get_db, User, PredictionLog

load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# ============================
# Security Configuration
# ============================
SECRET_KEY = os.getenv("JWT_SECRET", "super-secret-krushiai-key-change-me-in-prod")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 day

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/token")

# ============================
# Pydantic Models
# ============================

class UserRegister(BaseModel):
    email: Optional[str] = None
    password: Optional[str] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None


class GoogleAuth(BaseModel):
    email: str
    full_name: Optional[str] = None


class PhoneAuth(BaseModel):
    phone: str
    full_name: Optional[str] = "Phone User"


class PredictionLogRequest(BaseModel):
    prediction_type: str
    input_data: Optional[str] = None
    result: Optional[str] = None
    confidence: Optional[float] = None


# ============================
# Application Setup
# ============================
app = FastAPI(
    title="KrushiAI API",
    description="Backend API for KrushiAI Smart Farming Assistant",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENWEATHERMAP_API_KEY = os.getenv("OPENWEATHERMAP_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# ============================
# Auth Helper Functions
# ============================

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a plain password using bcrypt."""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token with an expiration time."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> User:
    """Validate JWT token and return the authenticated user."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        subject: str = payload.get("sub")
        if subject is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.email == subject).first()
    if user is None:
        raise credentials_exception
    return user


# ============================
# Health Check
# ============================

@app.get("/api/health")
async def health_check():
    """Health check endpoint for monitoring."""
    return {
        "status": "healthy",
        "service": "KrushiAI Backend",
        "version": "2.0.0",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


# ============================
# Authentication Endpoints
# ============================

@app.post("/api/register")
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user with email/password or phone."""
    if not user_data.email and not user_data.phone:
        raise HTTPException(status_code=400, detail="Email or Phone is required")

    # Check if user already exists
    query = db.query(User)
    if user_data.email:
        query = query.filter(User.email == user_data.email)
    elif user_data.phone:
        query = query.filter(User.phone == user_data.phone)

    if query.first():
        raise HTTPException(status_code=400, detail="User already registered")

    hashed_pw = get_password_hash(user_data.password) if user_data.password else None
    new_user = User(
        email=user_data.email,
        phone=user_data.phone,
        full_name=user_data.full_name,
        hashed_password=hashed_pw,
        provider="local",
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    logger.info(f"New user registered: {user_data.email or user_data.phone}")
    return {"message": "User created successfully"}


@app.post("/api/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    """Authenticate user and return JWT token."""
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not user.hashed_password or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    logger.info(f"User logged in: {user.email}")
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "full_name": user.full_name,
    }


@app.post("/api/auth/google")
async def google_auth(auth_data: GoogleAuth, db: Session = Depends(get_db)):
    """Google OAuth authentication (mock implementation)."""
    user = db.query(User).filter(User.email == auth_data.email).first()
    if not user:
        user = User(
            email=auth_data.email,
            full_name=auth_data.full_name,
            provider="google",
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        logger.info(f"New Google user: {auth_data.email}")

    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "full_name": user.full_name,
    }


@app.post("/api/auth/phone")
async def phone_auth(auth_data: PhoneAuth, db: Session = Depends(get_db)):
    """Phone OTP authentication (mock implementation)."""
    user = db.query(User).filter(User.phone == auth_data.phone).first()
    if not user:
        user = User(
            phone=auth_data.phone,
            full_name=auth_data.full_name,
            provider="phone",
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        logger.info(f"New phone user: {auth_data.phone}")

    access_token = create_access_token(data={"sub": f"phone_{auth_data.phone}"})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "full_name": user.full_name,
    }


# ============================
# Weather Endpoints
# ============================

@app.get("/api/weather/{city}")
async def get_weather(city: str):
    """Get current weather data for a city."""
    if not OPENWEATHERMAP_API_KEY:
        raise HTTPException(status_code=500, detail="Weather API key not configured")

    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={OPENWEATHERMAP_API_KEY}&units=metric"
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(url)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="City not found or API error")
        return response.json()


@app.get("/api/weather/coords/{lat}/{lon}")
async def get_weather_coords(lat: float, lon: float):
    """Get current weather data by coordinates."""
    if not OPENWEATHERMAP_API_KEY:
        raise HTTPException(status_code=500, detail="Weather API key not configured")

    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHERMAP_API_KEY}&units=metric"
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(url)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Weather API error")
        return response.json()


@app.get("/api/forecast/coords/{lat}/{lon}")
async def get_forecast_coords(lat: float, lon: float):
    """Get 5-day weather forecast by coordinates."""
    if not OPENWEATHERMAP_API_KEY:
        raise HTTPException(status_code=500, detail="Weather API key not configured")

    url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={OPENWEATHERMAP_API_KEY}&units=metric"
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(url)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Forecast API error")
        return response.json()


@app.get("/api/geo/{city}")
async def get_geo(city: str):
    """Get geographic coordinates for a city name."""
    if not OPENWEATHERMAP_API_KEY:
        raise HTTPException(status_code=500, detail="Weather API key not configured")

    url = f"https://api.openweathermap.org/geo/1.0/direct?q={city}&limit=1&appid={OPENWEATHERMAP_API_KEY}"
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(url)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Geocoding API error")
        return response.json()


# ============================
# Chat Proxy Endpoint
# ============================

@app.post("/api/chat")
async def chat(request: Request):
    """Proxy endpoint for OpenRouter LLM chat completions."""
    if not OPENROUTER_API_KEY:
        raise HTTPException(status_code=500, detail="OpenRouter API key not configured")

    body = await request.json()
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(url, headers=headers, json=body)
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Chat API error: {response.text}",
            )
        return response.json()


# ============================
# Prediction Logging
# ============================

@app.post("/api/predictions/log")
async def log_prediction(
    log_data: PredictionLogRequest, db: Session = Depends(get_db)
):
    """Log a prediction for analytics and auditing."""
    log_entry = PredictionLog(
        prediction_type=log_data.prediction_type,
        input_data=log_data.input_data,
        result=log_data.result,
        confidence=log_data.confidence,
    )
    db.add(log_entry)
    db.commit()
    return {"message": "Prediction logged successfully"}


@app.get("/api/predictions/stats")
async def prediction_stats(db: Session = Depends(get_db)):
    """Get prediction statistics for analytics dashboard."""
    total_predictions = db.query(PredictionLog).count()
    crop_predictions = db.query(PredictionLog).filter(PredictionLog.prediction_type == "crop").count()
    fertilizer_predictions = db.query(PredictionLog).filter(PredictionLog.prediction_type == "fertilizer").count()
    disease_predictions = db.query(PredictionLog).filter(PredictionLog.prediction_type == "disease").count()

    return {
        "total": total_predictions,
        "by_type": {
            "crop": crop_predictions,
            "fertilizer": fertilizer_predictions,
            "disease": disease_predictions,
        },
    }


# ============================
# Application Entry Point
# ============================

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )
