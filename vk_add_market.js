'use strict'; 
import fs from 'fs';
import FormData from 'form-data';
import { VK_API } from './token_private.js';
import vkApiService from './api/vkApiService.js'

const vkApi = vkApiService();

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

const getPhotoUploadServer = async () => {
    const form = new FormData();
    form.append('access_token', VK_API.access_token);
    form.append('v', VK_API.v);
    form.append('group_id', VK_API.group_id);
    const res = vkApi.getProductPhotoUploadServer(form);
    return res;
};
const uploadPhoto = async (url, imgPath) => {
    const form = new FormData();
    form.append('file', fs.createReadStream(imgPath));
    const res = await vkApi.uploadPhoto(url, form);
    return res;
};
const saveProductPhoto = async (uploadResponse) => {
    const form = new FormData();
    form.append('access_token', VK_API.access_token);
    form.append('v', VK_API.v);
    form.append('upload_response', uploadResponse);
    const res = await vkApi.saveProductPhoto(form);
    return res;
};

uploadProductPhoto('./images/3237220546/0.webp');