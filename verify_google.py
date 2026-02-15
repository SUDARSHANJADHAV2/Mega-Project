
import asyncio
from playwright.async_api import async_playwright

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto('http://localhost:8501')
        await asyncio.sleep(5)

        # Click Google Tab
        await page.click('text="Google"')
        await asyncio.sleep(2)

        # Click Continue with Google
        await page.click('text="Continue with Google"')

        await asyncio.sleep(10)
        await page.screenshot(path='verification/google_login_success.png')

        content = await page.content()
        if "Welcome, Google User!" in content:
            print("Google Login Successful!")
        else:
            print("Google Login failed")
            text = await page.evaluate("() => document.body.innerText")
            print(f"Page text: {text[:500]}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())
