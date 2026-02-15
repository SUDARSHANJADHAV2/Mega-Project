from playwright.sync_api import sync_playwright, expect
import time

def verify_login_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        # Navigate to the streamlit app
        print("Navigating to http://localhost:8501")
        page.goto("http://localhost:8501", timeout=60000)

        # Wait for Streamlit to load its elements
        try:
            # Look for something that indicates the page has loaded
            page.wait_for_selector('div[data-testid="stAppViewContainer"]', timeout=30000)
            print("Page loaded.")
        except Exception as e:
            print(f"Timeout waiting for page load: {e}")

        time.sleep(10) # Give it some more time to render content

        # Take a screenshot
        page.screenshot(path="/home/jules/verification/login_page.png", full_page=True)
        print("Screenshot saved to /home/jules/verification/login_page.png")

        # Try to switch to Sign Up tab if possible
        try:
            signup_tab = page.get_by_text("Sign Up")
            if signup_tab.is_visible():
                signup_tab.click()
                time.sleep(2)
                page.screenshot(path="/home/jules/verification/signup_tab.png", full_page=True)
                print("Signup tab screenshot saved.")
        except:
            print("Could not find Sign Up tab.")

        browser.close()

if __name__ == "__main__":
    import os
    if not os.path.exists("/home/jules/verification"):
        os.makedirs("/home/jules/verification")
    verify_login_page()
