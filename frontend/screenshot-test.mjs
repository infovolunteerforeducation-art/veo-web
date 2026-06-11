import { chromium } from 'playwright';

const browser = await chromium.launch({ args: ['--no-sandbox'], headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();

await page.goto('http://localhost:3000/crm', { timeout: 30000 });
// Wait for React hydration
await page.waitForTimeout(3000);
await page.screenshot({ path: 'crm-signin.png', fullPage: true });
console.log('Screenshot saved: crm-signin.png');

const text = await page.innerText('body');
console.log('Body text (first 300):', text.slice(0, 300));

await browser.close();
