const puppeteer = require('puppeteer');

(async () => {
  // Launch browser
  const browser = await puppeteer.launch({ headless: false }); // Launch in non-headless mode for visibility
  const page = await browser.newPage();

  // Set cookie
  await page.setCookie({
    name: 'PHPSESSID',
    value: '5i7lvtmd8qsvsh360bvfrt9iq7',
    domain: 'solingo.education',
    path: '/admin/unsubscription/unsubscribeForm',
    secure: true,
    httpOnly: true,
    sameSite: 'None' // Depending on the website's SameSite policy
  });

  // Visit website
  await page.goto('http://solingo.education/private/admin/unsubscription/unsubscribeForm');

  // Wait for some time to see the result
  await page.waitForTimeout(5000);

  // Close the browser
  await browser.close();
})();
