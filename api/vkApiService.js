import apiService from './apiService.js';

const api = apiService();

const baseUrl = 'https://api.vk.com/method';

const options = {
    headers: {
        'Content-Type': 'multipart/form-data',
    }
}

export default function vkApiService() {
    const getProductPhotoUploadServer = async (data) => {
        const url = `${baseUrl}/market.getProductPhotoUploadServer`;
        const res = await api.post(url, data, options);
        return res.response?.upload_url;
    }
    const uploadPhoto = async (url, data) => {
        const res = await api.post(url, data, options);
        return JSON.stringify(res);
    }
    const saveProductPhoto = async (data) => {
        const url = `${baseUrl}/market.saveProductPhoto`;
        const res = await api.post(url, data, options);
        return res.response?.photo_id;
    }

    return {
        getProductPhotoUploadServer,
        uploadPhoto,
        saveProductPhoto
    }
}