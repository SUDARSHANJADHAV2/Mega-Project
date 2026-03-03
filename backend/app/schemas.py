from pydantic import BaseModel

class CropRequest(BaseModel):
    nitrogen: float
    phosphorus: float
    potassium: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

class FertilizerRequest(BaseModel):
    temperature: float
    humidity: float
    moisture: float
    soil_type: str
    crop_type: str
    nitrogen: float
    potassium: float
    phosphorous: float

class FullNameRequest(BaseModel):
    full_name: str
    email: str
    password: str

class LedgerRequest(BaseModel):
    date: str
    description: str
    category: str
    tx_type: str
    amount: float

class ChatRequest(BaseModel):
    message: str

class MarketPriceRequest(BaseModel):
    crop: str

class YieldRequest(BaseModel):
    crop: str
    area: float
    rainfall: float
    fertilizer: float
