const { chromium } = require('playwright');
const { execSync } = require('child_process');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 }
  });

  const siteUrl = 'http://localhost:4173'; // Using local server

  // Ensure directories exist
  ['themes', 'sections', 'views', 'modals'].forEach(dir => {
    fs.mkdirSync(`src/assets/screenshots/${dir}`, { recursive: true });
  });

  console.log(`Navigating to ${siteUrl}`);
  await page.goto(siteUrl, { waitUntil: 'networkidle' });

  console.log('Generating theme screenshots...');
  await page.screenshot({ path: 'src/assets/screenshots/themes/theme_light.png' });

  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'src/assets/screenshots/themes/theme_dark.png' });

  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
  });

  console.log('Generating section screenshots...');
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'src/assets/screenshots/sections/section_overview.png' });

  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'src/assets/screenshots/sections/section_foundations.png' });

  console.log('Generating views screenshots...');
  // /reader
  await page.goto(`${siteUrl}/reader`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'src/assets/screenshots/views/view_reader.png' });

  // /gcc-metrics
  await page.goto(`${siteUrl}/gcc-metrics`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'src/assets/screenshots/views/view_gcc_metrics.png' });

  // /bcm
  await page.goto(`${siteUrl}/bcm`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'src/assets/screenshots/views/view_bcm.png' });

  await browser.close();

  console.log('Generating site-demo.gif...');
  try {
     execSync('convert -delay 150 -loop 0 src/assets/screenshots/themes/theme_light.png src/assets/screenshots/themes/theme_dark.png src/assets/screenshots/sections/section_overview.png src/assets/screenshots/views/view_reader.png src/assets/screenshots/views/view_gcc_metrics.png src/assets/screenshots/views/view_bcm.png src/assets/screenshots/site-demo.gif');
     console.log('Done!');
  } catch(e) {
     console.error('Error generating gif: ', e.message);
  }

})();
