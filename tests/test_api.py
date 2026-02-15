import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_read_root():
    # FastAPI root doesn't have a GET / but it should exist
    response = client.get("/")
    assert response.status_code == 404

def test_weather_no_key():
    # Should return 500 if key is not configured
    response = client.get("/api/weather/London")
    assert response.status_code == 500
    assert "Weather API key not configured" in response.json()["detail"]

def test_chat_no_key():
    # Should return 500 if key is not configured
    response = client.post("/api/chat", json={"messages": [{"role": "user", "content": "hi"}]})
    assert response.status_code == 500
    assert "OpenRouter API key not configured" in response.json()["detail"]
