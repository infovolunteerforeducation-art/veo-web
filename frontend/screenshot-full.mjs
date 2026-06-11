import { chromium } from 'playwright';

const browser = await chromium.launch({ args: ['--no-sandbox'], headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();

await page.goto('http://localhost:3000/crm', { timeout: 30000 });
await page.waitForTimeout(2000);
await page.screenshot({ path: 'crm-signin.png' });
console.log('Sign-in page: crm-signin.png');

// Click admin demo button
const adminBtn = await page.locator('button', { hasText: 'admin' }).first();
await adminBtn.click();
await page.waitForTimeout(300);
await page.screenshot({ path: 'crm-filled.png' });
console.log('Filled: crm-filled.png');

// Login
await page.click('button[type="submit"]');
await page.waitForTimeout(2000);
await page.screenshot({ path: 'crm-dashboard.png' });
console.log('After login: crm-dashboard.png');

const bodyText = await page.innerText('body');
console.log('Has Dashboard text:', bodyText.includes('Dashboard'));

await browser.close();
