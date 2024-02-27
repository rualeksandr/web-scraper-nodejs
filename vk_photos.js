'use strict'; 
import fs from 'fs';
import request from 'request';
import { VK_API } from './token_private.js';

// Метод photos.getUploadServer получает адрес сервера для загрузки фотографии.
photosGetUploadServer();
async function photosGetUploadServer() {
    const url = 'https://api.vk.com/method/photos.getUploadServer';
    const formData = {
        access_token: VK_API.access_token,
        v: VK_API.v,
        album_id: VK_API.album_id,
        group_id: VK_API.group_id
    };
    request.post({url, formData}, (error, httpResponse, body) => {
        if (error) {
            return console.error(error);
        }
        const res = JSON.parse(body);
        photosUpload(res.response.upload_url);
    });
}

// Передача файла на сервер.
async function photosUpload(url) {
    const formData = {
        photo: fs.createReadStream('./images/2820914401/0.webp'),
    };
    request.post({url, formData}, (error, httpResponse, body) => {
        if (error) {
            return console.error(error);
        }
        const res = JSON.parse(body);
        photosSave(res.server, res.photos_list, res.hash, 'Title title title title', 900000)
    });
}

// Метод photos.save сохраняет фотографии в альбом после их успешной загрузки на сервер.
async function photosSave(server, photos_list, hash, title, price) {
    const url = 'https://api.vk.com/method/photos.save';
    const formData = {
        access_token: VK_API.access_token,
        v: VK_API.v,
        album_id: VK_API.album_id,
        group_id: VK_API.group_id,
        server: server,
        photos_list: photos_list,
        hash: hash,
        latitude: VK_API.latitude,
        longitude: VK_API.longitude,
        caption: `${title} \n Цена: ${price}₽ \n В наличии в магазине TechnoTrade \n Челябинск, Кирова 62а/2 \n +7 (951) 116-77-67`
    };
    request.post({url, formData}, (error, httpResponse, body) => {
        if (error) {
            return console.error(error);
        }
        console.log(body);
    });
}