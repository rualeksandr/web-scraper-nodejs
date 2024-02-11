import puppeteer from 'puppeteer';
import cron from 'node-cron';
import fs from 'fs';

const URL_AVITO_PROFILE = 'https://www.avito.ru/user/f9c2c9b95c387c86227f847540f011db/profile';
const PARSIN_FREQUENCY = '*/2 * * * *'; // Сейчас 1 раз в 2 минуты (на этапе тестирования, после надо сократить до 1 раз в час)
let dataFromDatabase;
let dataForRecording = [];

parserAvitoProfile();
async function parserAvitoProfile() {
    const browser = await puppeteer.launch({
        userDataDir: '/tmp/myChromeSession',
        headless: false
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1440,
        height: 900
    });
    await page.goto(URL_AVITO_PROFILE)
    .catch((err) => console.log("Не получилось стартовать, т.к. не открылась страница профиля «Techno Trade» на Авито!"));
    await page.waitForTimeout(1000);
    await cron.schedule(PARSIN_FREQUENCY, function() {
        (async () => { 
            try {
                await getDataFromDatabase();
                await page.evaluate(() => {
                    location.reload(true)
                    console.log('2');
                })
                await page.waitForTimeout(2000);
                await autoScroll(page, 50000);
                let allAds = await page.$$('[data-marker="profile-items"] > div > div', e => e);
                for(let elem of allAds) {
                    let name = await elem.$eval('a', e => e.getAttribute('title'));
                    name = name.split('«')[1].split('»')[0]
                    let url = await elem.$eval('a', e => e.getAttribute('href'));
                    let id = url.split('_').pop();
                    let price = await elem.$eval('[itemprop="price"]', e => e.getAttribute('content'));
                    let img = await elem.$eval('img', e => e.getAttribute('src'));
                    handlerSingleAd(name, url, id, price, img)
                }
            } catch (err){
                console.log(`Пропущена итерация обновления страницы, т.к. на странице сейчас отсутствуют нужные данные! ${err}`);
            }
        })();
        console.log(dataForRecording);
        console.log(dataForRecording.length);
    });
}

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

// getDataFromDatabase();
function getDataFromDatabase() {
    const data = fs.readFileSync('data.json', { encoding: 'utf8', flag: 'r' });
    dataFromDatabase = JSON.parse(data)['data'];
}

function handlerSingleAd(name, url, id, price, img) {
    let objForPush = {};
    for (let i = 0; i < dataFromDatabase.length; i++) {
        if(id == dataFromDatabase[i]['id']){
            console.log(`id: ${id} уже есть в бд!`);
            objForPush = dataFromDatabase[i];
            dataForRecording.push(objForPush);
            objForPush = {};
            return;
        }
    }
    console.log(`id: ${id} нет в бд!`);
    objForPush["id"] = id;
    objForPush["title"] = name;
    objForPush["url"] = url;
    objForPush["price"] = price;
    objForPush["img_small"] = img;
    dataForRecording.push(objForPush);
    objForPush = {};
}