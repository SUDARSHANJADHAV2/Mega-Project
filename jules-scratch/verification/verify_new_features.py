import time
from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    # Navigate to the main page
    page.goto("http://localhost:8000")

    # Click the button to go to the new features dashboard
    page.locator('a[href="http://localhost:8504"]').click()
    page.wait_for_timeout(5000) # Wait for new page to open
    new_page = page.context.pages[-1]
    new_page.wait_for_load_state()

    # Verify the main welcome page of the new app
    expect(new_page.locator('h1:has-text("Welcome to KrushiAI\'s New Features!")')).to_be_visible()
    new_page.screenshot(path="jules-scratch/verification/0_main_dashboard.png")

    # Navigate to Weather Dashboard and verify
    new_page.locator('span[label="Weather Dashboard"]').click()
    new_page.wait_for_timeout(3000)
    expect(new_page.locator('h1:has-text("Weather Dashboard & Crop Calendar")')).to_be_visible()
    new_page.screenshot(path="jules-scratch/verification/1_weather_dashboard.png")

    # Navigate to Market Watch and verify
    new_page.locator('span[label="Market Watch"]').click()
    new_page.wait_for_timeout(3000)
    expect(new_page.locator('h1:has-text("Market Price Intelligence")')).to_be_visible()
    new_page.screenshot(path="jules-scratch/verification/2_market_watch.png")

    # Navigate to Irrigation Planner and verify
    new_page.locator('span[label="Irrigation Planner"]').click()
    new_page.wait_for_timeout(3000)
    expect(new_page.locator('h1:has-text("Smart Irrigation Management System")')).to_be_visible()
    new_page.screenshot(path="jules-scratch/verification/3_irrigation_planner.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)