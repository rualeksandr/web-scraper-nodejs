'use strict'; 
import fs from 'fs';
import request from 'request';
import { VK_API } from './token_private.js';

await market_upload_img('./images/3237220546/0.webp');

async function market_upload_img(img_path) {
    const upload_url = await getProductPhotoUploadServer();
    console.log(`upload_url: ${upload_url}`);
    // const upload_response = await photosUpload(upload_url, img_path);
    // console.log(`upload_response: ${upload_response}`);
    // const obj_photo_id = await photosSave(upload_response);
    // console.log(`obj_photo_id: ${obj_photo_id}`);
}

// Метод market.getProductPhotoUploadServer возвращает адрес для загрузки изображений товаров в сообщество.
async function getProductPhotoUploadServer() {
    const url = 'https://api.vk.com/method/market.getProductPhotoUploadServer';
    const formData = {
        access_token: VK_API.access_token,
        v: VK_API.v,
        group_id: VK_API.group_id
    };
    request.post({url, formData}, (error, httpResponse, body) => {
        if (error) {
            return console.error(error);
        }
        const res = JSON.parse(body);

        console.log(res.response.upload_url);
        return res.response.upload_url;
    });
}

// Передача файла на сервер. В ответе вернётся объект, содержащий служебную информацию о загруженном изображении.
async function photosUpload(upload_url, img_path) {
    const formData = {
        photo: fs.createReadStream(img_path),
    };
    request.post({upload_url, formData}, (error, httpResponse, body) => {
        if (error) {
            return console.error(error);
        }
        const res = JSON.parse(body);
        photosSave(res);
    });
}

// Метод market.saveProductPhoto сохраняет фотографии в альбом после их успешной загрузки на сервер.
// Возвращает объект с полем photo_id, которое содержит идентификатор загруженного изображения.
async function photosSave(upload_response) {
    const url = 'https://api.vk.com/method/market.getProductPhotoUploadServer';
    const formData = {
        access_token: VK_API.access_token,
        v: VK_API.v,
        upload_response: upload_response
    };
    request.post({url, formData}, (error, httpResponse, body) => {
        if (error) {
            return console.error(error);
        }
        const res = JSON.parse(body);
        photosSave(res);
    });
}