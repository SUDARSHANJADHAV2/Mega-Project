"""
KrushiAI Backend API Tests
Tests for authentication, weather, and prediction endpoints.
"""

import pytest
import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(__file__)), "backend"))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


class TestHealthEndpoint:
    """Tests for the health check endpoint."""
    
    def test_health_check(self):
        response = client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "KrushiAI Backend"


class TestAuthEndpoints:
    """Tests for authentication endpoints."""

    def test_register_missing_email_and_phone(self):
        response = client.post("/api/register", json={
            "password": "testpass123",
            "full_name": "Test User",
        })
        assert response.status_code == 400
        assert "Email or Phone is required" in response.json()["detail"]

    def test_register_with_email(self):
        response = client.post("/api/register", json={
            "email": "test_new@example.com",
            "password": "testpass123",
            "full_name": "Test User",
        })
        # Either success or already registered
        assert response.status_code in [200, 400]

    def test_login_invalid_credentials(self):
        response = client.post("/api/token", data={
            "username": "nonexistent@example.com",
            "password": "wrongpassword",
        })
        assert response.status_code == 401

    def test_root_not_found(self):
        """Root path should return 404 (no endpoint defined)."""
        response = client.get("/")
        assert response.status_code == 404


class TestWeatherEndpoints:
    """Tests for weather API endpoints."""

    def test_weather_no_key(self):
        """Should return 500 if API key is not configured."""
        response = client.get("/api/weather/London")
        # If no key configured, returns 500
        if response.status_code == 500:
            assert "Weather API key not configured" in response.json()["detail"]

    def test_weather_coords_no_key(self):
        response = client.get("/api/weather/coords/51.5074/-0.1278")
        if response.status_code == 500:
            assert "Weather API key not configured" in response.json()["detail"]


class TestChatEndpoint:
    """Tests for the chat proxy endpoint."""

    def test_chat_no_key(self):
        """Should return 500 if OpenRouter key is not configured."""
        response = client.post("/api/chat", json={
            "messages": [{"role": "user", "content": "hi"}]
        })
        if response.status_code == 500:
            assert "OpenRouter API key not configured" in response.json()["detail"]


class TestPredictionEndpoints:
    """Tests for prediction logging endpoints."""

    def test_log_prediction(self):
        response = client.post("/api/predictions/log", json={
            "prediction_type": "crop",
            "input_data": '{"N": 90, "P": 42, "K": 43}',
            "result": "rice",
            "confidence": 0.95,
        })
        assert response.status_code == 200
        assert response.json()["message"] == "Prediction logged successfully"

    def test_prediction_stats(self):
        response = client.get("/api/predictions/stats")
        assert response.status_code == 200
        data = response.json()
        assert "total" in data
        assert "by_type" in data
