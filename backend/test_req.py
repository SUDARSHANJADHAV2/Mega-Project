import urllib.request
import json
import traceback

data = json.dumps({'full_name': 'Tester', 'email': 'test@test.com', 'password': 'password123'}).encode('utf-8')
req = urllib.request.Request('http://localhost:8000/api/register', data=data, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as response:
        print("Success:", response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print(f"HTTP Error {e.code}:")
    try:
        print(e.read().decode('utf-8'))
    except Exception as read_e:
        print("Could not read error body:", read_e)
except Exception as e:
    print(f"Other Error: {e}")
