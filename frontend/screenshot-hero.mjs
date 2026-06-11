import { chromium } from 'playwright';
const browser = await chromium.launch({ args: ['--no-sandbox'], headless: true });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
await page.goto('http://localhost:3000', { timeout: 30000 });
await page.waitForTimeout(2000);
await page.screenshot({ path: 'hero-slider.png' });
console.log('Saved hero-slider.png');
await browser.close();
