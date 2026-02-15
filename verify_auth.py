
import asyncio
from playwright.async_api import async_playwright

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto('http://localhost:8501')
        await asyncio.sleep(5)

        # Take screenshot of login page
        await page.screenshot(path='verification/login_page.png')
        print("Captured Login Page")

        # Attempt Login (using the user we registered via curl earlier)
        # We need to find the input fields. Streamlit uses labels or types.
        await page.get_by_label("Email").fill("test@example.com")
        await page.get_by_label("Password").fill("password123")
        await page.click('button:has-text("Login")')

        await asyncio.sleep(5)
        await page.screenshot(path='verification/after_login.png')
        print("Captured After Login")

        # Check if "Welcome, Test User!" is present
        content = await page.content()
        if "Welcome, Test User!" in content:
            print("Login Successful!")
        else:
            print("Login failed or 'Welcome, Test User!' not found")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())
