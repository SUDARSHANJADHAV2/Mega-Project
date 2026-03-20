import requests

BASE_URL = "http://localhost:8000/api"

print("--- Testing API Endpoints ---")

# 1. Test Crop Predictor
try:
    res = requests.post(f"{BASE_URL}/predict-crop", json={
        "nitrogen": 90, "phosphorus": 42, "potassium": 43,
        "temperature": 20.8, "humidity": 82.0, "ph": 6.5, "rainfall": 202.9
    })
    print(f"Crop Predictor: {res.status_code} - {res.json()}")
except Exception as e:
    print(f"Crop Predictor failed: {e}")

# 2. Test Fertilizer Predictor
try:
    res = requests.post(f"{BASE_URL}/predict-fertilizer", json={
        "temperature": 26, "humidity": 52, "moisture": 38,
        "soil_type": "Sandy", "crop_type": "Maize",
        "nitrogen": 37, "potassium": 0, "phosphorous": 0
    })
    print(f"Fertilizer Predictor: {res.status_code} - {res.json()}")
except Exception as e:
    print(f"Fertilizer Predictor failed: {e}")

# 3. Test Crop Yield
try:
    res = requests.post(f"{BASE_URL}/predict-yield", json={
        "crop": "Wheat", "area": 5.0, "rainfall": 800, "fertilizer": 100
    })
    print(f"Crop Yield: {res.status_code} - {res.json()}")
except Exception as e:
    print(f"Crop Yield failed: {e}")

# 4. Test Chatbot
try:
    res = requests.post(f"{BASE_URL}/chatbot", json={
        "message": "Hello, how to grow wheat?", "history": []
    })
    print(f"Chatbot: {res.status_code} - {res.json()}")
except Exception as e:
    print(f"Chatbot failed: {e}")

# 5. Test Disease Predictor (need a mock image)
try:
    with open("test_img.jpg", "wb") as f:
        f.write(b'\xFF\xD8\xFF\xE0\x00\x10JFIF\x00\x01\x01\x01\x00H\x00H\x00\x00\xFF\xDB\x00C\x00\xff\xff\xff') # Corrupt jpeg for test
    files = {'file': open("test_img.jpg", 'rb')}
    res = requests.post(f"{BASE_URL}/predict-disease", files=files)
    print(f"Disease Predictor: {res.status_code} - {res.text[:100]}")
except Exception as e:
    print(f"Disease Predictor failed: {e}")
