import os
import requests
import datetime
import random
from bs4 import BeautifulSoup
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app import models
from app.database import get_db

router = APIRouter(
    prefix="/api",
    tags=["Market & News"],
)

@router.get("/mandi-prices")
def get_real_market_prices(crop: str, state: str, db: Session = Depends(get_db)):
    """
    Replaces mocked Mandi prices with data.gov.in Agmarknet API prices, cached in SQLite for 6 hours.
    # FIXED: Replaced async def with def to prevent synchronous requests.get from blocking the event loop.
    """
    cache_ttl = datetime.timedelta(hours=6)
    cutoff = datetime.datetime.utcnow() - cache_ttl
    
    # 1. Check Cache
    cached = db.query(models.MandiCache).filter(
        models.MandiCache.commodity.ilike(crop),
        models.MandiCache.state.ilike(state),
        models.MandiCache.timestamp >= cutoff
    ).first()
    
    if cached:
        return {
            "crop": crop,
            "state": state,
            "current_price_per_quintal": cached.price,
            "min_price": cached.min_price,
            "max_price": cached.max_price,
            "market": cached.market,
            "trend": "stable",
            "source": "cache"
        }
        
    # 2. Fetch from API
    api_key = os.getenv("DATA_GOV_API_KEY")
    if api_key and api_key.strip():
        try:
            url = f"https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key={api_key}&format=json&filters[commodity]={crop}&filters[state]={state}&limit=10"
            res = requests.get(url, timeout=10)
            data = res.json()
            if data and "records" in data and len(data["records"]) > 0:
                prices = [float(r['modal_price']) for r in data['records'] if r.get('modal_price')]
                min_prices = [float(r['min_price']) for r in data['records'] if r.get('min_price')]
                max_prices = [float(r['max_price']) for r in data['records'] if r.get('max_price')]
                
                avg_price = sum(prices) / len(prices) if prices else 2500
                avg_min = sum(min_prices) / len(min_prices) if min_prices else 2000
                avg_max = sum(max_prices) / len(max_prices) if max_prices else 3000
                top_market = data['records'][0].get("market", "Various")

                new_cache = models.MandiCache(
                    commodity=crop, state=state, price=avg_price, min_price=avg_min, max_price=avg_max, market=top_market
                )
                db.add(new_cache)
                db.commit()
                
                return {
                    "crop": crop, "state": state, "current_price_per_quintal": round(avg_price, 2),
                    "min_price": round(avg_min, 2), "max_price": round(avg_max, 2),
                    "market": top_market, "trend": "live update", "source": "api"
                }
        except Exception:
            pass # fallback 
            
    # 3. Fallback Hardcoded
    fallback_price = 2650 
    return {
        "crop": crop, "state": state, "current_price_per_quintal": fallback_price,
        "min_price": fallback_price - 200, "max_price": fallback_price + 300,
        "market": "Regional Average (Offline Mode)", "trend": "stable", "source": "fallback"
    }

@router.get("/agri-news")
def get_agri_news():
    try:
        url = "https://news.google.com/rss/search?q=agriculture+india&hl=en-IN&gl=IN&ceid=IN:en"
        response = requests.get(url, timeout=5)
        soup = BeautifulSoup(response.content, features="xml")
        
        items = soup.findAll('item')
        news_list = []
        for item in items[:6]:
            news_list.append({
                "title": item.title.text if hasattr(item.title, 'text') else str(item.title),
                "link": item.link.text if hasattr(item.link, 'text') else str(item.link),
                "pubDate": item.pubDate.text if hasattr(item.pubDate, 'text') else str(item.pubDate),
                "source": item.source.text if getattr(item, 'source', None) else "Agriculture News"
            })
        return {"status": "success", "articles": news_list, "news": news_list}
    except Exception as e:
        return {"status": "error", "message": f"Scraper Failed: {str(e)}", "articles": [], "news": []}

@router.get("/v3/market-listings")
async def get_market_listings():
    return [
        {"id": 1, "crop": 'Premium Wheat', "variety": 'Lokwan', "quantity": '100 Qtl', "price": 2350, "location": 'Nagpur, MH', "farmer": 'Ramesh Patil', "rating": 4.8},
        {"id": 2, "crop": 'Organic Cotton', "variety": 'BT-Cotton', "quantity": '50 Qtl', "price": 7100, "location": 'Yavatmal, MH', "farmer": 'Suresh Kumar', "rating": 4.5},
        {"id": 3, "crop": 'Basmati Rice', "variety": 'Pusa 1121', "quantity": '200 Qtl', "price": 3800, "location": 'Karnal, HR', "farmer": 'Harjeet Singh', "rating": 4.9}
    ]

# --- Feature O6: Mandi Receipt Verifier ---
class MandiReceiptRequest(BaseModel):
    commodity: str
    quantity_quintals: float
    received_price: float
    sale_date: str
    mandi_name: str

@router.post("/verify-receipt")
def verify_mandi_receipt(data: MandiReceiptRequest):
    # Fallback to simulated MSP comparison
    mock_msp = 2275.0 if data.commodity.lower() == "wheat" else 2183.0 # Rice MSP proxy
    mock_market = mock_msp + random.uniform(-200, 300)
    
    vs_msp = round(((data.received_price - mock_msp) / mock_msp) * 100, 1)
    vs_market = round(((data.received_price - mock_market) / mock_market) * 100, 1)
    
    verdict = "Fair Trade"
    if vs_msp < -5.0:
        verdict = f"You received {abs(vs_msp)}% below MSP. You may be eligible to file a complaint."
        
    return {
        "received_price": data.received_price,
        "msp": mock_msp,
        "market_price": round(mock_market, 1),
        "vs_msp": f"{vs_msp}%",
        "vs_market": f"{vs_market}%",
        "verdict": verdict,
        "complaint_portal": "https://pgportal.gov.in"
    }

@router.get("/v3/equipment-rentals")
async def get_equipment_rentals():
    return [
        {"id": 1, "name": 'Mahindra 575 DI Tractor', "type": 'Tractor', "hp": '45 HP', "rate": 600, "location": '5km away', "owner": 'FarmTech Co.'},
        {"id": 2, "name": 'John Deere Combine Harvester', "type": 'Harvester', "hp": '75 HP', "rate": 2500, "location": '12km away', "owner": 'Raju Rentals'},
        {"id": 3, "name": 'Honda Water Pump 5HP', "type": 'Pump', "hp": '5 HP', "rate": 100, "location": '2km away', "owner": 'Suresh P'}
    ]

@router.get("/v3/schemes")
async def get_government_schemes():
    return [
        {"id": 1, "name": 'PM-KISAN Samman Nidhi', "desc": 'Provides income support of ₹6,000 per year.', "tags": ['Cash Transfer'], "eligible": True},
        {"id": 2, "name": 'PKVY (Paramparagat Krishi Vikas Yojana)', "desc": 'Promotes organic farming.', "tags": ['Organic Farming'], "eligible": True}
    ]
