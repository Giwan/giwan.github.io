import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1280, 'height': 800})

        # Check About page
        await page.goto('http://localhost:4321/about')
        await page.screenshot(path='/home/jules/verification/about_page.png', full_page=True)
        print("About page screenshot saved.")

        # Check Tools page
        await page.goto('http://localhost:4321/tools')
        await page.screenshot(path='/home/jules/verification/tools_page.png', full_page=True)
        print("Tools page screenshot saved.")

        await browser.close()

asyncio.run(run())
