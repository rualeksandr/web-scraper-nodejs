'use strict'; 
import puppeteer from 'puppeteer';
import cron from 'node-cron';
import fs from 'fs';

const URL_AVITO_PROFILE = 'https://www.avito.ru/user/3bca7883e70b770fcca6536d8e7a3c8a/profile';
const PARSING_FREQUENCY = '*/2 * * * *';
let dataFromDatabase = [];
let dataForRecording = [];

startParser();
async function startParser() {
    dataFromDatabase = [];
    dataForRecording = [];
    const browser = await launchBrowser();
    await getDataFromDatabase();
    // await parserAvitoProfile(browser);
}

async function launchBrowser() {
    const browser = await puppeteer.launch({
        userDataDir: '/tmp/chromeSessionForParserAvitoProfile',
        headless: false
    });
    return browser;
}

async function getDataFromDatabase() {
    try {
        const data = fs.readFileSync('data.json', { encoding: 'utf8', flag: 'r' });
        dataFromDatabase = JSON.parse(data)['data'];
      } catch (err) {
        dataFromDatabase = [];
        console.log(`Файла нет (похоже это первый запуск): ${err}`);
    }
}

async function parserAvitoProfile(browser) {
    const page = await browser.newPage();
    await page.setViewport({
        width: 1440,
        height: 900
    });
    await page.goto(URL_AVITO_PROFILE)
    .catch((err) => console.log(`Проблема с открытием страницы профиля: ${err}`));
    await page.waitForTimeout(2000);
    const h1 = await page.$eval('h1', el => el.textContent).catch((err) => console.log(`Отсутствует H1: ${err}`));
    if(h1 == 'Пользователь не найден') {
        console.log(`ERROR: h1 = 'Пользователь не найден' url = ${URL_AVITO_PROFILE}`);
        return false;
    }
    const h2 = await page.$eval('h2', el => el.textContent).catch((err) => console.log(`Отсутствует H2: ${err}`));
    if(h2 !== 'Объявления пользователя') {
        console.log(`ERROR: h2 != 'Объявления пользователя' url = ${URL_AVITO_PROFILE}`);
        return false;
    }
    try {
        await getDataFromDatabase();
        await page.evaluate(() => {
            location.reload(true)
            console.log('2');
        })
        await page.waitForTimeout(1000);
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
    await updateDatainDatabase();
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

function handlerSingleAd(name, url, id, price, img) {
    let objForPush = {};
    for (let i = 0; i < dataFromDatabase.length; i++) {
        if(id == dataFromDatabase[i]['id']){
            objForPush = dataFromDatabase[i];
            dataForRecording.push(objForPush);
            objForPush = {};
            return;
        }
    }
    objForPush["id"] = id;
    objForPush["title"] = name;
    objForPush["url"] = url;
    objForPush["price"] = price;
    objForPush["img_small"] = img;
    objForPush["parse"] = {};
    objForPush["parse"]["status"] = "low";
    objForPush["vkPost"] = {};
    objForPush["vkPost"]["status"] = "unpublished";
    objForPush["vkProduct"] = {};
    objForPush["vkProduct"]["status"] = "unpublished";
    objForPush["tgPost"] = {};
    objForPush["tgPost"]["status"] = "unpublished";
    dataForRecording.push(objForPush);
    objForPush = {};
}

async function updateDatainDatabase() {
    let lengthDataOld = dataFromDatabase.length;
    let lengthDataNew = dataForRecording.length;

    if(Math.floor(lengthDataOld*0.9) <= lengthDataNew) {
        let formatedData = {};
        formatedData["data"] = dataForRecording;
        let data = JSON.stringify(formatedData, null, 2); 
        fs.writeFileSync('data.json', data); 
        console.log(`Успешно записан новый файл data.json! lengthDataNew = ${lengthDataNew}; lengthDataOld = ${lengthDataOld}`);
    } else {
        console.log(`Err record new data: lengthDataNew = ${lengthDataNew}; lengthDataOld = ${lengthDataOld}; Разница больше 10%!`);
        return false;
    }
    return;
}

async function parserAvitoProduct() {
    const browser = await puppeteer.launch({
        userDataDir: '/tmp/chromeSessionForParserAvitoProduct',
        headless: false
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1440,
        height: 900
    });
    cron.schedule(PARSING_FREQUENCY_PRODUCT, function() {
        if (dataFromDatabase.length) {

        } else {
            console.log(`В переменно dataFromDatabase поканичего нет, пропускаю апдейт данных!`)
        }

    });
}