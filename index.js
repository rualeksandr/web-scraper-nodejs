'use strict'; 
import puppeteer from 'puppeteer';
import cron from 'node-cron';
import fs from 'fs';

const URL_AVITO_PROFILE = 'https://www.avito.ru/user/f9c2c9b95c387c86227f847540f011db/profile';
const PARSING_FREQUENCY_PROFILE = '*/2 * * * *';
const PARSING_FREQUENCY_PRODUCT = '*/2 * * * *';
let dataFromDatabase = [];
let dataForRecording = [];

startParser();
async function startParser() {
    await getDataFromDatabase()
    await parserAvitoProfile();
    parserAvitoProduct()
}

async function parserAvitoProfile() {
    const browser = await puppeteer.launch({
        userDataDir: '/tmp/chromeSessionForParserAvitoProfile',
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
    cron.schedule(PARSING_FREQUENCY_PROFILE, function() {
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
            await updateDatainDatabase();
        })();
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
async function getDataFromDatabase() {
    try {
        const data = fs.readFileSync('data.json', { encoding: 'utf8', flag: 'r' });
        dataFromDatabase = JSON.parse(data)['data'];
      } catch (err) {
        dataFromDatabase = [];
        console.log(`Файла нет (похоже это первый запуск): ${err}`);
    }
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
    if(dataForRecording.length) {
        let formatedData = {};
        formatedData["data"] = dataForRecording;
        let data = JSON.stringify(formatedData, null, 2); 
        fs.writeFileSync('data.json', data); 
        console.log("Записан файл data.json!");
    } else {
        console.log("При попытке записать в БД обновленные данные, они пришли пустые!");
    }
    dataForRecording = [];
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



        // (async () => { 
        // })();
    });
}