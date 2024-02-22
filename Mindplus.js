const puppeteer = require('puppeteer');

(async () => {
  // Launch browser
  const browser = await puppeteer.launch({ headless: false }); // Launch in non-headless mode for visibility
  const page = await browser.newPage();

  // Set cookie
  await page.setCookie({
    name: 'PHPSESSID',
    value: 'ebpmcv4p5i0r5kcc70dodus570',
    domain: 'mindplus.store',
    path: '/private/admin/unsubscription',
    secure: true,
    httpOnly: true,
    sameSite: 'None' // Depending on the website's SameSite policy
  });

  // Visit website
  await page.goto('https://mindplus.store/private/admin/unsubscription/unsubscribeForm');

  // Wait for page to load
  await page.waitForSelector('#msisdn_msisdn');

  // Input mobile number
  await page.type('#msisdn_msisdn', '923125432857');

  // Click submit button
  await Promise.all([
    page.waitForNavigation(), // Wait for navigation to complete
    page.click('.btn-primary') // Click the submit button
  ]);

  // Wait for details page to load
  await page.waitForSelector('.btn-info');

  // Click details button
  await Promise.all([
    page.waitForNavigation(), // Wait for navigation to complete
    page.click('.btn-info') // Click the details button
  ]);

  // Wait for unsubscribe button
  await page.waitForSelector('.btn-danger');

  // Click unsubscribe button
  await page.click('.btn-danger');

  // Optionally, wait for some time to observe the result
  await page.waitForTimeout(5000);

  // Close the browser
  await browser.close();
})();
