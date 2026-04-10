const { chromium } = require('playwright');
const { execSync } = require('child_process');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 }
  });

  const siteUrl = 'https://kr-healthcare-guidebook-hub.lovable.app/';

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

  await page.evaluate(() => window.scrollTo(0, 1800));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'src/assets/screenshots/sections/section_value_chain.png' });

  await page.evaluate(() => window.scrollTo(0, 2400));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'src/assets/screenshots/sections/section_commercial.png' });

  await page.evaluate(() => window.scrollTo(0, 3000));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'src/assets/screenshots/sections/section_enablers.png' });

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'src/assets/screenshots/sections/section_resources.png' });

  console.log('Generating views and modals screenshots...');
  await page.evaluate(() => window.scrollTo(0, 0));

  try {
    const tabs = await page.$$('[role="tab"]');
    if (tabs.length > 0) {
       for (let i = 0; i < Math.min(tabs.length, 3); i++) {
         await tabs[i].click();
         await page.waitForTimeout(1000);
         await page.screenshot({ path: `src/assets/screenshots/views/view_${i}.png` });
       }
    } else {
       await page.screenshot({ path: 'src/assets/screenshots/views/view_reader.png' });
       await page.evaluate(() => window.scrollTo(0, 400));
       await page.screenshot({ path: 'src/assets/screenshots/views/view_gcc_metrics.png' });
    }
  } catch (e) {
    console.error(e);
  }

  try {
     const buttons = await page.$$('button');
     if (buttons.length > 5) {
        await buttons[5].click();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'src/assets/screenshots/modals/modal_chapter_view.png' });
     } else {
       await page.screenshot({ path: 'src/assets/screenshots/modals/modal_chapter_view.png' });
     }
  } catch(e) {
    console.error(e);
  }

  await browser.close();

  console.log('Generating site-demo.gif...');
  try {
     execSync('convert -delay 150 -loop 0 src/assets/screenshots/themes/theme_light.png src/assets/screenshots/themes/theme_dark.png src/assets/screenshots/sections/section_overview.png src/assets/screenshots/sections/section_foundations.png src/assets/screenshots/sections/section_value_chain.png src/assets/screenshots/sections/section_commercial.png src/assets/screenshots/sections/section_enablers.png src/assets/screenshots/sections/section_resources.png src/assets/screenshots/site-demo.gif');
     console.log('Done!');
  } catch(e) {
     console.error('Error generating gif: ', e.message);
  }

})();
