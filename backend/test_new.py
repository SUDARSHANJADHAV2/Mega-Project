import requests

BASE_URL = "http://127.0.0.1:8000/api"

print("--- Testing Profitability Engine ---")
res1 = requests.post(f"{BASE_URL}/predict-profit", json={
    "crop": "Wheat", "area": 10.0, "budget": 50000.0, "expected_yield_tons": 25.0
})
print("Status:", res1.status_code)
print("Response:", res1.json())

print("\n--- Testing Crop Calendar Engine ---")
res2 = requests.post(f"{BASE_URL}/predict-calendar", json={
    "crop": "Rice", "sowing_date": "2026-06-01", "soil_type": "Black"
})
print("Status:", res2.status_code)
print("Response:", res2.json())
