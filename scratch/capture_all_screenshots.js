const path = require("path");
const puppeteer = require(path.join(__dirname, "../frontend/node_modules/puppeteer-core"));
const fs = require("fs");

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE_URL = "http://localhost:3000";
const OUTPUT_DIR = "c:\\Users\\Owner\\Downloads\\Amazon-Clone-main";

async function run() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    defaultViewport: {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    },
    args: ["--window-size=1920,1080", "--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // ==========================================
  // PART A: ADMIN FEATURES (01 - 05)
  // ==========================================
  console.log("Logging in as Admin...");
  await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle0" });
  await page.waitForSelector('input[placeholder="Email or Username"]');
  
  await page.type('input[placeholder="Email or Username"]', "mainadmin@@1212");
  await page.type('input[type="password"]', "adminadmin@@");
  
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: "networkidle0" }).catch(() => {}),
  ]);

  await new Promise(r => setTimeout(r, 2000));
  console.log("Current URL after admin login:", page.url());

  // 01_Admin_Dashboard.png
  console.log("Capturing 01_Admin_Dashboard.png...");
  await page.goto(`${BASE_URL}/admin/dashboard`, { waitUntil: "networkidle0" });
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "01_Admin_Dashboard.png") });

  // 02_User_Management.png
  console.log("Capturing 02_User_Management.png...");
  await page.evaluate(() => window.scrollTo(0, 300));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "02_User_Management.png") });

  // 03_Seller_Approval.png
  console.log("Capturing 03_Seller_Approval.png...");
  await page.goto(`${BASE_URL}/admin/sellers`, { waitUntil: "networkidle0" });
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "03_Seller_Approval.png") });

  // 04_Product_Management.png
  console.log("Capturing 04_Product_Management.png...");
  await page.goto(`${BASE_URL}/admin/products`, { waitUntil: "networkidle0" });
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "04_Product_Management.png") });

  // 05_Order_Management.png
  console.log("Capturing 05_Order_Management.png...");
  await page.goto(`${BASE_URL}/seller/orders`, { waitUntil: "networkidle0" });
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "05_Order_Management.png") });

  // ==========================================
  // PART B: USER MAP FEATURES (06 - 07)
  // ==========================================
  console.log("Logging out admin and logging in as User...");
  // Clear cookies/tokens by navigating to login
  const cookies = await page.cookies();
  await page.deleteCookie(...cookies);
  
  await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle0" });
  await page.waitForSelector('input[placeholder="Email or Username"]');
  
  await page.type('input[placeholder="Email or Username"]', "user@example.com");
  await page.type('input[type="password"]', "user123");
  
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: "networkidle0" }).catch(() => {}),
  ]);

  await new Promise(r => setTimeout(r, 2000));
  console.log("Current URL after user login:", page.url());

  // 06_India_Map_Default.png (User Profile Map)
  console.log("Capturing 06_India_Map_Default.png (User Map)...");
  await page.goto(`${BASE_URL}/profile`, { waitUntil: "networkidle0" });
  await page.evaluate(() => window.scrollTo(0, 350));
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "06_India_Map_Default.png") });

  // 07_India_Map_State_Selected.png (User Map Location Selected)
  console.log("Capturing 07_India_Map_State_Selected.png (User Map Location)...");
  const searchInput = await page.$('input[placeholder*="New Delhi"]');
  if (searchInput) {
    await searchInput.click({ clickCount: 3 });
    await searchInput.type("New Delhi, India");
    await new Promise(r => setTimeout(r, 500));
    await searchInput.press("Enter");
    await new Promise(r => setTimeout(r, 5000));
  }
  await page.evaluate(() => window.scrollTo(0, 350));
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(OUTPUT_DIR, "07_India_Map_State_Selected.png") });

  console.log("All 7 screenshots (Admin & User) captured successfully!");
  await browser.close();
}

run().catch((err) => {
  console.error("Error capturing screenshots:", err);
  process.exit(1);
});
