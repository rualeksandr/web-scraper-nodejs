import { MongoClient, ServerApiVersion } from 'mongodb';
import { DB_CONNECT } from './token_private.js';
import fs from 'fs';
import puppeteer from 'puppeteer';

const client = new MongoClient(DB_CONNECT.url, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

export async function advancedParsingAd() { 
    try {
        await client.connect();
        console.log("Успешно подключились к MongoDB!");
        const database = client.db(DB_CONNECT.dbName);
        const collection = database.collection(DB_CONNECT.collectionName);
        try {
            const processedIds = [];
            const lowProducts = await collection.find({"status": "low"}).toArray();
            const browser = await puppeteer.launch({
                userDataDir: '/tmp/chromeSessionForParserAvitoProfile',
                headless: false
            });
            for (const product of lowProducts) {
                const page = await browser.newPage();
                await page.setViewport({
                    width: 1440,
                    height: 900
                });
                await page.goto('https://www.avito.ru' + product.url)
                .catch((err) => console.log(`Проблема с открытием страницы одного объявления: ${err}`));
                await page.waitForTimeout(2000);
                product.description = await page.$eval('[data-marker="item-view/item-description"]', el => el.innerText)
                .catch((err) => console.log(`Проблема с получением description: ${err}`));
                const breadcrumbs = await page.$$('[data-marker="breadcrumbs"] > span', e => e)
                .catch((err) => console.log(`Проблема с получением breadcrumbs: ${err}`));
                product.category_avito = await breadcrumbs[breadcrumbs.length - 1].$eval('a', e => e.getAttribute('title'))
                .catch((err) => console.log(`Проблема с получением title у последнего элемента из breadcrumbs: ${err}`));

                const listPreviewPhoto = await page.$$('[data-marker="image-preview/preview-wrapper"] > li:not([data-type="video"])', e => e)
                .catch((err) => console.log(`Проблема с получением listPreviewPhoto: ${err}`));
                product.images = []; // {url: '', path: ''}
                for(let img of listPreviewPhoto) {
                    img.click();
                    await page.waitForTimeout(1000);
                    // const imgUrl = await page.$eval('[data-marker="image-frame/image-wrapper"] > img', e => e.getAttribute('src'))
                    // .catch((err) => console.log(`Проблема с получением imgUrl: ${err}`));
                    const blockImg = await page.$('[data-marker="image-frame/image-wrapper"]');
                    blockImg.click();
                    await page.waitForTimeout(3000);
                    const imgUrl = await page.$eval('[data-marker="extended-gallery/frame-wrapper"] > img', e => e.getAttribute('src'))
                    .catch((err) => console.log(`Проблема с получением imgUrl: ${err}`));
                    await page.keyboard.press('Escape');
                    await page.waitForTimeout(1000);
                    const pageIMG = await browser.newPage();
                    await pageIMG.setViewport({
                        width: 1440,
                        height: 900
                    });
                    let viewSource = await pageIMG.goto(imgUrl);
                    await pageIMG.waitForTimeout(2000);
                    const imgPath = `./images/${product.id_avito}/${product.images.length}.webp`;
                    await fs.promises.mkdir(`./images/${product.id_avito}/`, { recursive: true }).catch(console.error);
                    fs.writeFile(imgPath, await viewSource.buffer(), function (err) {
                    if (err) {
                        return console.log(err);
                    }
                        console.log("The file was saved!");
                    });
                    await pageIMG.waitForTimeout(1000);
                    await pageIMG.close();
                    product.images.push({
                        "url": imgUrl,
                        "path": imgPath
                    })
                };
                product.status = 'high';
                await collection.updateOne({ 'id_avito': product.id_avito }, { $set: product });
                processedIds.push(product.id_avito);
                await page.close();
            }
            return processedIds;
        } catch (err) {
            console.error(`Что-то пошло не так при попытке вставить новые документы: ${err}\n`);
            return [];
        }
    } finally {
        await browser.close();
        await client.close();
        console.log("Закрыли подключение к MongoDB!");
    }
}