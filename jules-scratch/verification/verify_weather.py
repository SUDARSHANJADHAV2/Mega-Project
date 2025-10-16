import time
from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    for _ in range(3):
        try:
            page.goto("http://localhost:8000")
            break
        except Exception as e:
            print(f"Connection failed: {e}. Retrying in 5 seconds...")
            time.sleep(5)

    page.goto("http://localhost:8504")
    page.wait_for_load_state("load", timeout=30000)
    # Wait for a specific element that indicates the app has loaded
    expect(page.locator('h1:has-text("Weather Dashboard & Crop Calendar")')).to_be_visible(timeout=15000)
    page.screenshot(path="jules-scratch/verification/weather_dashboard.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)