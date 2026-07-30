const path = require('path');
const puppeteer = require(path.join(__dirname, '../frontend/node_modules/puppeteer-core'));

async function testRemoveSeller() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('response', async res => {
    if (res.url().includes('/api/admin/sellers/')) {
      console.log('API RESPONSE [', res.status(), ']', res.url());
      try { console.log(await res.text()); } catch(e){}
    }
  });

  await page.goto('http://localhost:3000/login');
  await page.type('input[name="email"]', 'mainadmin@@1212');
  await page.type('input[name="password"]', 'adminadmin@@');
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle0' })
  ]);

  await page.goto('http://localhost:3000/admin/sellers', { waitUntil: 'networkidle0' });
  console.log('On sellers page. Finding remove buttons...');

  const buttons = await page.$$('button');
  let clicked = false;
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text === 'Remove seller') {
      console.log('Clicking Remove seller button...');
      await btn.click();
      clicked = true;
      await new Promise(r => setTimeout(r, 2000));
      break;
    }
  }

  if (!clicked) {
    console.log('Could not find Remove seller button');
  }

  await browser.close();
}
testRemoveSeller();
