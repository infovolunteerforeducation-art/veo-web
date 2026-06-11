import { chromium } from 'playwright';
const browser = await chromium.launch({ args: ['--no-sandbox'], headless: true });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
await page.goto('http://localhost:3000/crm', { timeout: 30000 });
await page.waitForTimeout(2000);
await page.screenshot({ path: 'crm-signin.png' });
console.log('Saved crm-signin.png');
await browser.close();
