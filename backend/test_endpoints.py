import requests
import json
import os

BASE_URL = "http://127.0.0.1:8000/api"

def print_result(name, res):
    if res.status_code == 200:
        print(f"✅ [PASS] {name} | Response: {str(res.json())[:100]}...")
    else:
        print(f"❌ [FAIL] {name} | Status: {res.status_code} | Error: {res.text}")

# 1. Predict Crop
print("\n--- Testing Crop Recommender ---")
res = requests.post(f"{BASE_URL}/predict-crop", json={
    "nitrogen": 80, "phosphorus": 40, "potassium": 40,
    "temperature": 22.5, "humidity": 60, "ph": 6.5, "rainfall": 150
})
print_result("Predict Crop", res)

# 2. Predict Fertilizer
print("\n--- Testing Fertilizer Recommender ---")
res = requests.post(f"{BASE_URL}/predict-fertilizer", json={
    "temperature": 26, "humidity": 52, "moisture": 38,
    "soil_type": "Sandy", "crop_type": "Maize",
    "nitrogen": 37, "potassium": 0, "phosphorous": 0
})
print_result("Predict Fertilizer", res)

# 3. Market Prices
print("\n--- Testing Market Prices ---")
res = requests.post(f"{BASE_URL}/market-prices", json={"crop": "Wheat"})
print_result("Market Prices", res)

# 4. Chatbot
print("\n--- Testing Chatbot (Gemini SDK) ---")
res = requests.post(f"{BASE_URL}/chatbot", json={"message": "What is the best soil pH for wheat?"})
print_result("Chatbot", res)

# 5. Predict Yield
print("\n--- Testing Yield Predictor ---")
res = requests.post(f"{BASE_URL}/predict-yield", json={
    "crop": "Wheat", "area": 5.0, "rainfall": 800.0, "fertilizer": 150.0
})
print_result("Predict Yield", res)

# 6. Predict Irrigation
print("\n--- Testing Irrigation Forecaster ---")
res = requests.post(f"{BASE_URL}/predict-irrigation", json={
    "crop": "Wheat", "temperature": 32.5, "humidity": 45.0,
    "soil_type": "Loam", "expected_weather": "Sunny", "forecasted_rainfall_mm": 0,
    "irrigation_method": "Drip"
})
print_result("Predict Irrigation", res)

# 7. Predict Schemes
print("\n--- Testing Govt Schemes ---")
res = requests.post(f"{BASE_URL}/predict-schemes", json={
    "state": "Maharashtra", "land_area": 2.5, "category": "General", "income": 50000
})
print_result("Predict Schemes", res)

# --- Multipart File Testing ---
import tempfile
from PIL import Image

def test_vision_endpoint(endpoint):
    print(f"\n--- Testing Vision: {endpoint} ---")
    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as f:
        img = Image.new('RGB', (100, 100), color = 'green')
        img.save(f, format='JPEG')
        temp_path = f.name
    
    try:
        with open(temp_path, "rb") as image_file:
            files = {"file": ("test_leaf.jpg", image_file, "image/jpeg")}
            res = requests.post(f"{BASE_URL}/{endpoint}", files=files)
            print_result(endpoint, res)
    finally:
        os.remove(temp_path)

test_vision_endpoint("predict-disease")
test_vision_endpoint("predict-weed")
test_vision_endpoint("predict-pest")

print("\n🚀 E2E API Validation Complete.")
