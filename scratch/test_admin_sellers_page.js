const path = require("path");
const puppeteer = require(path.join(__dirname, "../frontend/node_modules/puppeteer-core"));

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE_URL = "http://localhost:3000";

async function testPage() {
  console.log("Launching browser for live debugging...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();
  
  page.on("console", (msg) => console.log("BROWSER LOG:", msg.text()));
  page.on("pageerror", (err) => console.error("BROWSER PAGE ERROR:", err.message));

  // 1. Log in as Admin
  console.log("Logging in as Admin...");
  await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle0" });
  await page.type('input[placeholder="Email or Username"]', "mainadmin@@1212");
  await page.type('input[type="password"]', "adminadmin@@");
  
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: "networkidle0" }),
  ]);

  // 2. Navigate to /admin/sellers
  console.log("Navigating to http://localhost:3000/admin/sellers ...");
  await page.goto(`${BASE_URL}/admin/sellers`, { waitUntil: "networkidle0" });
  await new Promise(r => setTimeout(r, 2000));

  const textContent = await page.evaluate(() => document.body.innerText);
  console.log("\n=== RENDERED TEXT ON /admin/sellers ===");
  console.log(textContent);

  await browser.close();
}

testPage().catch(console.error);
