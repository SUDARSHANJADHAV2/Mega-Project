import requests

BASE = "http://localhost:8000/api"

endpoints = [
    ("GET", f"{BASE}/satellite/ndvi?lat=20.0&lon=78.0&date_from=2023-01-01&date_to=2023-12-31"),
    ("POST", f"{BASE}/satellite/crop-map", {"lat": 20.0, "lon": 78.0, "declared_crop": "Wheat", "season": "Rabi"}),
    ("GET", f"{BASE}/satellite/climate-risk?lat=20.0&lon=78.0&crop=Wheat"),
    ("GET", f"{BASE}/satellite/ndvi-history?lat=20.0&lon=78.0&crop=Wheat"),
    ("GET", f"{BASE}/satellite/land-temperature?lat=20.0&lon=78.0"),
    ("GET", f"{BASE}/satellite/soil-moisture?lat=20.0&lon=78.0"),
    ("GET", f"{BASE}/satellite/canopy-cover?lat=20.0&lon=78.0"),
    
    ("GET", f"{BASE}/mlops/drift-status"),
    # MLOps ab-test payload is generic
    ("POST", f"{BASE}/mlops/ab-test", {"crop": "Wheat", "model_a": "v1", "model_b": "v2"}),
    ("POST", f"{BASE}/mlops/trigger-training", {}),
    
    ("POST", f"{BASE}/financial/loan-eligibility", {"income": 50000, "land_acres": 5, "credit_score": 750, "loan_amount": 100000}),
    ("POST", f"{BASE}/financial/insurance-premium", {"crop": "Wheat", "acres": 5, "coverage_level": "Comprehensive"}),
    ("POST", f"{BASE}/financial/profit-margin", {"crop": "Wheat", "yield_tons": 10, "cost_inr": 50000, "sell_price_per_ton": 25000}),
    
    ("GET", f"{BASE}/health/chemical-safety?chemical_name=Glyphosate"),
    ("GET", f"{BASE}/health/first-aid?incident_type=Snakebite"),
    ("GET", f"{BASE}/health/ergonomic-guidance"),
    ("GET", f"{BASE}/health/bns-legal-rights"),
    
    ("GET", f"{BASE}/education/vr-module?topic=Tractor"),
    ("GET", f"{BASE}/education/certification-quiz?topic=Organic"),
    ("GET", f"{BASE}/education/scholarships?state=MH")
]

fails = []

for method, url, *body in endpoints:
    try:
        if method == "GET":
            res = requests.get(url)
        else:
            res = requests.post(url, json=body[0])
            
        if res.status_code >= 500:
            print(f"❌ 500 ERROR on {url} - {res.text}")
            fails.append(url)
        elif res.status_code == 422:
            print(f"⚠️ 422 Validation Error on {url} - Payload might be wrong: {res.text}")
        else:
            print(f"✅ OK {res.status_code} on {url.split('?')[0]}")
    except Exception as e:
        print(f"❌ Exception on {url}: {e}")
        fails.append(url)

if not fails:
    print("\n🚀 ALL ENDPOINTS PASSED OR RETURNED EXPECTED 422s.")
else:
    print(f"\n❌ {len(fails)} ENDPOINTS FAILED.")
