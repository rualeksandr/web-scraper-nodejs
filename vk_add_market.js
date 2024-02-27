'use strict'; 
import fs from 'fs';
import axios from 'axios';
import { VK_API } from './token_private.js';

await market_upload_img('./images/3237220546/0.webp');

async function market_upload_img(img_path) {
    const upload_url = await getProductPhotoUploadServer();
    const upload_response = await photosUpload(upload_url, img_path);
    console.log(JSON.stringify(upload_response));
    const obj_photo_id = await photosSave(upload_response);
    console.log(JSON.stringify(obj_photo_id));
}

// Метод market.getProductPhotoUploadServer возвращает адрес для загрузки изображений товаров в сообщество.
async function getProductPhotoUploadServer() {
    const {data} = await axios.post('https://api.vk.com/method/market.getProductPhotoUploadServer', {
            access_token: VK_API.access_token,
            v: VK_API.v,
            group_id: VK_API.group_id
        }, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        }
    )
    return JSON.stringify(data.response.upload_url);
}

// Передача файла на сервер. В ответе вернётся объект, содержащий служебную информацию о загруженном изображении.
async function photosUpload(upload_url, img_path) {
    const {data} = await axios.post(upload_url, {
            file: fs.createReadStream(img_path),
        }, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        }
    )
    return data;
}

// Метод market.saveProductPhoto сохраняет фотографии в альбом после их успешной загрузки на сервер.
// Возвращает объект с полем photo_id, которое содержит идентификатор загруженного изображения.
async function photosSave(upload_response) {
    const {data} = await axios.post('https://api.vk.com/method/market.saveProductPhoto', {
        access_token: VK_API.access_token,
        v: VK_API.v,    
        upload_response: upload_response,
    }, {
        headers: {
        'Content-Type': 'multipart/form-data'
        }
    }
    )
    return data;
}