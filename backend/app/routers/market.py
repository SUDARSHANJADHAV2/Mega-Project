import requests
from bs4 import BeautifulSoup
from fastapi import APIRouter

router = APIRouter(
    prefix="/api",
    tags=["Market & News"],
)

@router.get("/agri-news")
async def get_agri_news():
    """
    Zero-Cost Web Scraper: Fetches live agriculture news from Google News RSS.
    """
    try:
        url = "https://news.google.com/rss/search?q=agriculture+india&hl=en-IN&gl=IN&ceid=IN:en"
        response = requests.get(url, timeout=5)
        soup = BeautifulSoup(response.content, features="xml")
        
        items = soup.findAll('item')
        news_list = []
        for item in items[:6]: # Limit to top 6 fresh articles
            news_list.append({
                "title": item.title.text if hasattr(item.title, 'text') else str(item.title),
                "link": item.link.text if hasattr(item.link, 'text') else str(item.link),
                "pubDate": item.pubDate.text if hasattr(item.pubDate, 'text') else str(item.pubDate),
                "source": item.source.text if getattr(item, 'source', None) else "Agriculture News"
            })
        return {"status": "success", "articles": news_list, "news": news_list}
    except Exception as e:
        return {"status": "error", "message": f"Scraper Failed: {str(e)}", "articles": [], "news": []}

# --- V3 PLATFORM MODULE MOCKS ---
@router.get("/v3/market-listings")
async def get_market_listings():
    """Mock database of peer-to-peer crop listings."""
    return [
        {"id": 1, "crop": 'Premium Wheat', "variety": 'Lokwan', "quantity": '100 Qtl', "price": 2350, "location": 'Nagpur, MH', "farmer": 'Ramesh Patil', "rating": 4.8},
        {"id": 2, "crop": 'Organic Cotton', "variety": 'BT-Cotton', "quantity": '50 Qtl', "price": 7100, "location": 'Yavatmal, MH', "farmer": 'Suresh Kumar', "rating": 4.5},
        {"id": 3, "crop": 'Basmati Rice', "variety": 'Pusa 1121', "quantity": '200 Qtl', "price": 3800, "location": 'Karnal, HR', "farmer": 'Harjeet Singh', "rating": 4.9}
    ]

@router.get("/v3/equipment-rentals")
async def get_equipment_rentals():
    """Mock database of peer-to-peer equipment rentals."""
    return [
        {"id": 1, "name": 'Mahindra 575 DI Tractor', "type": 'Tractor', "hp": '45 HP', "rate": 600, "location": '5km away', "owner": 'FarmTech Co.'},
        {"id": 2, "name": 'John Deere Combine Harvester', "type": 'Harvester', "hp": '75 HP', "rate": 2500, "location": '12km away', "owner": 'Raju Rentals'},
        {"id": 3, "name": 'Honda Water Pump 5HP', "type": 'Pump', "hp": '5 HP', "rate": 100, "location": '2km away', "owner": 'Suresh P'}
    ]

@router.get("/v3/schemes")
async def get_government_schemes():
    """Mock database of government agricultural schemes."""
    return [
        {"id": 1, "name": 'PM-KISAN Samman Nidhi', "desc": 'Provides income support of ₹6,000 per year.', "tags": ['Cash Transfer'], "eligible": True},
        {"id": 2, "name": 'PKVY (Paramparagat Krishi Vikas Yojana)', "desc": 'Promotes organic farming.', "tags": ['Organic Farming'], "eligible": True}
    ]
