'use strict'; 
import puppeteer from 'puppeteer';
import { CONFIG } from './token_private.js';
import { autoScroll } from './autoScroll.js';

export async function parserAvitoProfile() {
    let resultData = [];
    const browser = await puppeteer.launch({
        userDataDir: '/tmp/chromeSessionForParserAvitoProfile',
        headless: false
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1440,
        height: 900
    });
    await page.goto(CONFIG.url_avito_profile)
    .catch((err) => console.log(`Проблема с открытием страницы профиля: ${err}`));
    await page.waitForTimeout(2000);
    const h1 = await page.$eval('h1', el => el.textContent).catch(() => console.log(`Профиль существует!`));
    if(h1 == 'Пользователь не найден') {
        console.log(`ERROR: H1 = 'Неверная ссылка на профиль авито!' url = ${CONFIG.url_avito_profile}`);
        return false;
    }
    const h2 = await page.$eval('h2', el => el.textContent).catch((err) => console.log(`Отсутствует H2: ${err}`));
    if(h2 !== 'Объявления пользователя') {
        console.log(`Отсутствует заголовок H2: "Объявления пользователя". Возможно ссылка на профиль изменилась: ' url = ${URL_AVITO_PROFILE}`);
        return false;
    }
    await page.evaluate(() => {
        location.reload(true)
    })
    await page.waitForTimeout(1000);
    await autoScroll(page, 50000);
    const count = await page.$eval('[data-marker="profile-tab(active)"]', e => +e.innerText.split(' ', 1)[0]);
    let allAds = await page.$$('[data-marker="profile-items"] > div > div', e => e);
    for(let elem of allAds) {
        let ad = {};
        let name = await elem.$eval('a', e => e.getAttribute('title'));
        ad.name = name.split('«')[1].split('»')[0]
        ad.price = await elem.$eval('[itemprop="price"]', e => +e.getAttribute('content'));
        ad.url = await elem.$eval('a', e => e.getAttribute('href'));
        ad.id_avito = +ad.url.split('_').pop();
        ad.previewImg = await elem.$eval('img', e => e.getAttribute('src'));
        resultData.push(ad);
    }
    await page.close();
    await browser.close();
    if(resultData.length >= count-2) { 
        return resultData;
    } else {
        return false;
    }
}

