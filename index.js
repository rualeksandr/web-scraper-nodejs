import puppeteer from 'puppeteer';
import cron from 'node-cron';
import fs from 'fs';

(async () => {

    let dataOld = {};

    const browser = await puppeteer.launch({
        userDataDir: '/tmp/myChromeSession',
        headless: false
    });

    const page = await browser.newPage();

    await page.setViewport({
        width: 1440,
        height: 900
    });

    await page.goto('https://www.avito.ru/user/f9c2c9b95c387c86227f847540f011db/profile')
    .catch((err) => console.log("Не получилось стартовать, т.к. не открылась страница профиля «Techno Trade» на Авито!"));

    await page.waitForTimeout(1000);

    await cron.schedule('*/2 * * * *', function() {
        (async () => { 
            try {
                await page.evaluate(() => {
                    location.reload(true)
                })
                await page.waitForTimeout(2000);
                await autoScroll(page, 50000);

                let allAds = await page.$$('[data-marker="profile-items"] > div > div', e => e);

                let dataInIteration = {
                    data: {},
                    ids: [],
                    count: 0
                };

                for(let elem of allAds) {
                    let name = await elem.$eval('a', e => e.getAttribute('title'));
                    let url = await elem.$eval('a', e => e.getAttribute('href'));
                    let id = url.split('_').pop();
                    let price = await elem.$eval('[itemprop="price"]', e => e.getAttribute('content'));
                    let img = await elem.$eval('img', e => e.getAttribute('src'));

                    dataInIteration.ids.push(id);

                    let count = dataInIteration.count;
                    dataInIteration.data[count] = {};

                    dataInIteration.data[count]['id'] = id;
                    dataInIteration.data[count]['title'] = name;
                    dataInIteration.data[count]['url'] = url;
                    dataInIteration.data[count]['price'] = price;
                    dataInIteration.data[count]['img_small'] = img;

                    dataInIteration.count++;
                }

                console.log(dataInIteration);

                let profileItemsActive = Number(await page.$eval('[data-marker="profile-tab(active)"]', e => e.innerText.split(' ')[0]));
                
                console.log(`Активных объявлений на авито: ${profileItemsActive}. Получилось спарсить: ${dataInIteration.count}. Не удалось спарсить: ${profileItemsActive - dataInIteration.count}`);


                if (dataOld.ids) {
                    console.log('Это повторная итерация и мне есть с чем сравнить. Сейчас узнаю что изменилось.')
                } else {
                    console.log('Это первая итерация и мне не с чем сравнивать. Все объявления для меня новые!')
                    dataOld = dataInIteration;
                };


                // try {
                //     fs.writeFileSync('/Users/rualeksandr/Development/web-scraper-nodejs/data.json', JSON.stringify(dataInIteration), 'utf8');
                // } catch (err) {
                //     console.error(err)
                // }

            } catch (err){
                console.log('Пропущена итерация обновления страницы, т.к. на странице сейчас отсутствуют нужные данные!');
            }

        })();
    });
})();

// Автоскрол
async function autoScroll(page, maxScrolls){
    await page.evaluate(async (maxScrolls) => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 5;
            var scrolls = 0;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                scrolls++;

                if(totalHeight >= scrollHeight - window.innerHeight || scrolls >= maxScrolls){
                    clearInterval(timer);
                    resolve();
                }
            }, 60);
        });
    }, maxScrolls);
}


async function addAds(ids){

}

function updateAds(ids){

}

function deleteAds(ids){

}