const puppeteer = require('puppeteer');
const fs = require('fs');
const csv = require('csv-parser');

(async () => {
  // Read MSISDNs from CSV
  const msisdns = [];
  fs.createReadStream('msisdns.csv')
    .pipe(csv())
    .on('data', (row) => {
      msisdns.push(row['MSISDN']); // Assuming the column name is 'MSISDN'
    })
    .on('end', async () => {
      console.log('MSISDNs from CSV:', msisdns); // Log the MSISDNs read from CSV

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

      for (let msisdn of msisdns) {
        console.log(`Unsubscribing MSISDN: ${msisdn}`);

        // Wait for page to load
        await page.waitForSelector('#msisdn_msisdn');

        // Input mobile number
        await page.$eval('#msisdn_msisdn', el => el.value = ''); // Clear input field
        await page.type('#msisdn_msisdn', msisdn);

        // Click submit button
        await Promise.all([
          page.waitForNavigation(), // Wait for navigation to complete
          page.click('.btn-primary') // Click the submit button
        ]);

        // Wait for details page to load
        try {
          await page.waitForSelector('.btn-info', { timeout: 5000 });
        } catch (error) {
          console.log(`Details not found for MSISDN: ${msisdn}`);
          continue; // Move to the next MSISDN if details not found
        }

        // Click details button
        await Promise.all([
          page.waitForNavigation(), // Wait for navigation to complete
          page.click('.btn-info') // Click the details button
        ]);

        // Wait for unsubscribe button
        try {
          await page.waitForSelector('.btn-danger', { timeout: 5000 });
        } catch (error) {
          console.log(`Unsubscribe button not found for MSISDN: ${msisdn}`);
          continue; // Move to the next MSISDN if unsubscribe button not found
        }

        // Click unsubscribe button
        await page.click('.btn-danger');

        console.log(`Unsubscribed successfully for MSISDN: ${msisdn}`);
      }

      // Close the browser
      await browser.close();
    });
})();
