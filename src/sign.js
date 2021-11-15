const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

require('dotenv').config();
async function sign() {
  const options = {
    defaultViewport: {
      width: 400,
      height: 640,
      isMobile: true,
    },
    headless: true,
  };
  puppeteer.use(StealthPlugin());

  console.log('starting headless browser');
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  // const context = await browser.createIncognitoBrowserContext();
  // const page = await context.newPage();

  // set cache to false so session is not saved
  page.setCacheEnabled(false);

  // load main page
  await page.goto(process.env.URL);
  await page.waitForTimeout(3000);
  console.log('page loaded');
  await page.screenshot({
    path: 'initPageLoaded.png',
  });

  // click on button to fill statement
  await page.click('[value="מילוי הצהרת בריאות מקוונת"]');
  await page.waitForTimeout(3000);

  // fill in user details and signin
  if (await page.$$('.signin-page')) {
    console.log('logging in...');
    await page.type('[title="קוד משתמש"]', process.env.USER_CODE);
    await page.type('[title="סיסמה"]', process.env.PASSWORD);
    await page.click('#loginButton2');
    await page.waitForTimeout(7000);
    await page.screenshot({
      path: 'loggedIn.png',
    });
  }
  // get all kid-containers
  const kidContainers = await page.$$('.kid-container');
  const kidContainersToApprove = await page.$$('.kid-container [value="מילוי הצהרת בריאות"]');
  const kidContainersApproved = await page.$$('.kid-container .fa-check-circle');

  console.log(`Total kids count: ${kidContainers.length}`);
  let ids = [];
  for (const kid of kidContainers) {
    const id = await (await kid.getProperty('id')).jsonValue();
    ids.push(id);
  }
  console.log(`Kids IDs: ${ids}`);
  console.log(`Total kids approved count: ${kidContainersApproved.length}`);
  console.log(`Total kids to be approved count: ${kidContainersToApprove.length}`);

  for (const kid of kidContainersToApprove) {
    kid.click();
    await page.waitForTimeout(2000);
    try {
      //await page.click('[value="אישור"]');
      console.log(page.$$('[value="אישור"]'));
    } catch (e) {
      console.log('error clicking approve', e);
    }
    await page.waitForTimeout(2000);
  }
  await page.waitForTimeout(2000);

  await page.screenshot({
    path: 'done.png',
  });

  await page.screenshot({
    path: 'doneFullPage.png',
    fullPage: true,
  });

  await browser.close();
  console.log('All kids approved. Go to school and enjoy your day...');
}

sign();
exports.sign = sign;
