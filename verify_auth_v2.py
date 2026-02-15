
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

        # Attempt Login
        # Use exact match for Email label
        await page.get_by_label("Email", exact=True).fill("test@example.com")
        await page.get_by_label("Password", exact=True).fill("password123")
        await page.click('button:has-text("Login")')

        await asyncio.sleep(10) # Wait for login to process
        await page.screenshot(path='verification/after_login.png')

        # Check if "Welcome, Test User!" is present
        content = await page.content()
        if "Welcome, Test User!" in content:
            print("Login Successful!")
        else:
            print("Login failed or 'Welcome, Test User!' not found")
            # Print visible text to debug
            text = await page.evaluate("() => document.body.innerText")
            print(f"Page text: {text[:500]}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())
