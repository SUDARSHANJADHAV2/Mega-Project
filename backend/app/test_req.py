import requests
res = requests.post("http://localhost:8000/api/register", json={
    "full_name": "Test Form", "email": "tes45t@test.com", "password": "pass"
})
print("STATUS CODE:", res.status_code)
print("RESPONSE TEXT:", res.text)
