'use strict'; 
import puppeteer from 'puppeteer';

let data = [
    {
    "id": "3813383376",
    "title": "Современный офисный пк i3 6100, gt630, DDR4",
    "url": "/chelyabinsk/nastolnye_kompyutery/sovremennyy_ofisnyy_pk_i3_6100_gt630_ddr4_3813383376",
    "price": "12990",
    "img_small": "https://80.img.avito.st/image/1/1.HEEqhra1sKhcIQKpHs4ucyEksqiULXKuLCayqg.NaePYz-6Znnul9nbTKTA5nL6jgXTYLahBPDBRcErRVQ",
    "parser": {
      "status": "low"
    },
    "vkPost": {
      "status": "unpublished"
    },
    "vkProduct": {
      "status": "unpublished"
    },
    "tgPost": {
      "status": "unpublished"
    }
  },
  {
    "id": "3813035599",
    "title": "Мощный офисный пк I5 2500, GTX 750Ti, SSD",
    "url": "/chelyabinsk/nastolnye_kompyutery/moschnyy_ofisnyy_pk_i5_2500_gtx_750ti_ssd_3813035599",
    "price": "14990",
    "img_small": "https://90.img.avito.st/image/1/1.evsh1ra11hJXcWQTWccnyCp01BKffRQUJ3bUEA.lqRfCHtHwdSdFVyldKJftjl1yqsbIvPukYGuRFjMrUs",
    "parser": {
      "status": "high"
    },
    "vkPost": {
      "status": "unpublished"
    },
    "vkProduct": {
      "status": "unpublished"
    },
    "tgPost": {
      "status": "unpublished"
    }
  }
];

parserFullAd();
async function parserFullAd() {
    for(let elem of data) {
        const browser = await puppeteer.launch({
            userDataDir: '/tmp/chromeSessionForParserAvitoProfile',
            headless: false
        });
        if(elem.parser.status == 'low') {
            const page = await browser.newPage();
            await page.setViewport({
                width: 1440,
                height: 900
            });
            await page.goto('https://www.avito.ru' + elem.url)
            .catch((err) => console.log(`Проблема с открытием страницы одного объявления: ${err}`));
            await page.waitForTimeout(2000);
            const description = await page.$eval('[data-marker="item-view/item-description"]', el => el.innerText)
            .catch((err) => console.log(`Проблема с получением description: ${err}`));
            await page.waitForTimeout(2000);
            const breadcrumbs = await page.$$('[data-marker="breadcrumbs"] > span', e => e)
            .catch((err) => console.log(`Проблема с получением breadcrumbs: ${err}`));
            const lastBreadcrumb = await breadcrumbs[breadcrumbs.length - 1].$eval('a', e => e.getAttribute('title'))
            .catch((err) => console.log(`Проблема с получением title у последнего элемента из breadcrumbs: ${err}`));
            await page.waitForTimeout(2000);
            const listPreviewPhoto = await page.$$('[data-marker="image-preview/preview-wrapper"] > li', e => e)
            .catch((err) => console.log(`Проблема с получением listPreviewPhoto: ${err}`));
            for(let elem of listPreviewPhoto) {
                elem.click();
                await page.waitForTimeout(2000);
                const imgUrl = await page.$eval('[data-marker="image-frame/image-wrapper"] > img', e => e.getAttribute('src'))
                .catch((err) => console.log(`Проблема с получением imgUrl: ${err}`));
                await page.waitForTimeout(1000);
            }
            await page.close();
        } else if(elem.parser.status == 'high') {
            console.log(`Пропускаю парсинг объявления id:${elem.id} title:${elem.title} т.к. данные по нему уже есть в БД!`);
        } else {
            console.log(`Пропускаю парсинг объявления id:${elem.id} title:${elem.title} т.к. у него неизвестный parse.status:${elem.parser.status}!`);
        }
        await browser.close();
    }
}