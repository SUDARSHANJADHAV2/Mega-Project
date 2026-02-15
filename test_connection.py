
import requests

def test_backend():
    BACKEND_URL = "http://localhost:8000/api"
    try:
        r = requests.post(f"{BACKEND_URL}/token", data={"username": "test@example.com", "password": "password123"})
        print(f"Login Status: {r.status_code}")
        print(f"Response: {r.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_backend()
