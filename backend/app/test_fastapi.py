from fastapi.testclient import TestClient
from app.main import app
import traceback

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "Welcome to KrushiAI Unified Backend API V2"}

def test_agri_news():
    response = client.get("/api/agri-news")
    assert response.status_code == 200
    assert "articles" in response.json() or "news" in response.json()
