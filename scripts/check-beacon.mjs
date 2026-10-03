import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const hits = [];

  page.on('request', req => {
    const url = req.url();
    if (/cloudflareinsights|beacon.min.js|beacon/.test(url)) {
      hits.push({ type: 'request', method: req.method(), url });
    }
  });

  page.on('response', async res => {
    const url = res.url();
    if (/cloudflareinsights|beacon.min.js|beacon/.test(url)) {
      hits.push({ type: 'response', status: res.status(), url });
    }
  });

  try {
    await page.goto('https://discover.bisen-kyoto.com/', { waitUntil: 'networkidle' , timeout: 30000});
    // wait a bit for deferred scripts to run
    await page.waitForTimeout(3000);
  } catch (err) {
    console.error('Navigation error', err.message);
  }

  console.log('Captured hits:', JSON.stringify(hits, null, 2));
  await browser.close();
  process.exit(0);
})();