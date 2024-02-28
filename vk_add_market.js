'use strict'; 
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import { VK_API } from './token_private.js';

async function uploadProductPhoto(imgPath) {
    try {
        const uploadUrl = await getPhotoUploadServer();
        const uploadResponse = await uploadPhoto(uploadUrl, imgPath);
        const savedPhoto = await saveProductPhoto(uploadResponse);

        console.log("Фотография успешно загружена и сохранена:", savedPhoto);
    } catch (error) {
        console.error("Ошибка при загрузке фотографии товара: ", error);
    }
}

async function getPhotoUploadServer() {
    const { data } = await axios.post('https://api.vk.com/method/market.getProductPhotoUploadServer', {
        access_token: VK_API.access_token,
        v: VK_API.v,
        group_id: VK_API.group_id
    }, {
        headers: {
        'Content-Type': 'multipart/form-data'
        }
    });
    return data.response.upload_url;
}

async function uploadPhoto(url, imgPath) {
    const form = new FormData();
    form.append('file', fs.createReadStream(imgPath));
    const request_config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            ...form.getHeaders()
        }
    };
    const { data } = await axios.post(url, form, request_config);
    return JSON.stringify(data);
}

async function saveProductPhoto(uploadResponse) {
    const form = {
        'access_token': VK_API.access_token,
        'v': VK_API.v,
        'upload_response': uploadResponse
    }
    const { data } = await axios.post('https://api.vk.com/method/market.saveProductPhoto', form, {
        headers: {
        'Content-Type': 'multipart/form-data'
        }
    });
    if (data.response.photo_id) {
        return data.response.photo_id;
    } else {
        throw new Error("Ошибка при сохранении фотографии товара. Ответ: ", data);
    }
}

uploadProductPhoto('./images/3237220546/0.webp');