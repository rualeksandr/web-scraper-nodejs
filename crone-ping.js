import cron from 'node-cron';
import puppeteer from 'puppeteer';

(async () => {

const browser = await puppeteer.launch({
    userDataDir: '/tmp/myChromeSession',
    headless: false
});

const page = await browser.newPage();

await page.setViewport({
            width: 1440,
            height: 900
        });
        
await page.goto('https://ya.ru');

await page.waitForTimeout(3000);

await cron.schedule('*/5 * * * * *', function() {
    (async () => { 
        console.log('running a task every second');
        await page.goBack();
        await page.goForward();
    })();
  });

})();