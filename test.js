'use strict'; 
import fs from 'fs';
import request from 'request';
import { VK_API } from './token_private.js';

// let photos_getUploadServer = {
//     "response": {
//         "album_id": 301622171,
//         "upload_url": "https://pu.vk.com/c906128/ss2312/upload.php?act=do_add&mid=66544978&aid=301622171&gid=224729248&hash=8b3e65c5f491c03f9e13856a7f1ea87e&rhash=851313595c67c86b8088bcb066d560a3&swfupload=1&api=1",
//         "user_id": 66544978
//     }
// }

// let obj = {"server":906128,"photos_list":"[{\"markers_restarted\":true,\"photo\":\"48ed6f2e1c:y\",\"sizes\":[],\"latitude\":0,\"longitude\":0,\"kid\":\"71bbc8c5ae72e8e245446075cf159d54\",\"sizes2\":[[\"s\",\"2f6e82b0ea0f2787521ddd99307f960d85b17fc7dca384d802da82d9\",\"8467966423062181056\",75,56],[\"m\",\"9fc20f8a8f4f582b9f3cef41d2005768e9ed147ac17a90fdbd150f8e\",\"-9201907342435859570\",130,97],[\"x\",\"2d6f36080486bc13a550b438fb0b5a67ca90c318a1f6751d72920dc0\",\"3521653663924479658\",604,453],[\"y\",\"40772f7e6c82ed2209d3079ad2d5d6088a5ba187b3a9ced304a17d92\",\"-1707657353554468079\",640,480],[\"o\",\"5e97d9a7e62e9b6050d09a7f7c777f9038d886933830ee1d56dac76c\",\"6353999654651480154\",130,98],[\"p\",\"479637cc89dde47e05d24536981b896ef94c558e7908142c5a5f0419\",\"-2321896260688822024\",200,150],[\"q\",\"85348b2569931badb60fb05e42aff9e9af943144960b92550f49cf44\",\"370134210341338224\",320,240],[\"r\",\"4177ebc3b128f067d0f8d3c3bbf3cbf8599c0671b15c8fc15ff880d6\",\"-5296072234394386129\",510,383]],\"urls\":[],\"urls2\":[\"L26CsOoPJ4dSHd2ZMH-WDYWxf8fco4TYAtqC2Q/wHSOuJhChHU.jpg\",\"n8IPio9PWCufPO9B0gBXaOntFHrBepD9vRUPjg/jkMNngZCTIA.jpg\",\"LW82CASGvBOlULQ4-wtaZ8qQwxih9nUdcpINwA/quYrTFlt3zA.jpg\",\"QHcvfmyC7SIJ0wea0tXWCIpboYezqc7TBKF9kg/EWNNO68uTeg.jpg\",\"XpfZp-Yum2BQ0Jp_fHd_kDjYhpM4MO4dVtrHbA/Wsh0XgXxLVg.jpg\",\"R5Y3zInd5H4F0kU2mBuJbvlMVY55CBQsWl8EGQ/-MBVIKf3xt8.jpg\",\"hTSLJWmTG622D7BeQq_56a-UMUSWC5JVD0nPRA/cHydbhr7IgU.jpg\",\"QXfrw7Eo8GfQ-NPDu_PL-FmcBnGxXI_BX_iA1g/LwEd1FySgLY.jpg\"]}]","aid":301622171,"hash":"5bc05bbeb62c742eee146afd002ef159","gid":224729248}

// const url = 'https://pu.vk.com/c906128/ss2312/upload.php?act=do_add&mid=66544978&aid=301622171&gid=224729248&hash=8b3e65c5f491c03f9e13856a7f1ea87e&rhash=851313595c67c86b8088bcb066d560a3&swfupload=1&api=1';
// const formData = {
//     photo: fs.createReadStream('./images/2820914401/0.webp'),
// };

// request.post({url, formData}, (error, httpResponse, body) => {
//     if (error) {
//         return console.error(error);
//     }

//     console.log(body);
// });

// {"server":906128,"photos_list":"[{\"markers_restarted\":true,\"photo\":\"48ed6f2e1c:y\",\"sizes\":[],\"latitude\":0,\"longitude\":0,\"kid\":\"71bbc8c5ae72e8e245446075cf159d54\",\"sizes2\":[[\"s\",\"2f6e82b0ea0f2787521ddd99307f960d85b17fc7dca384d802da82d9\",\"8467966423062181056\",75,56],[\"m\",\"9fc20f8a8f4f582b9f3cef41d2005768e9ed147ac17a90fdbd150f8e\",\"-9201907342435859570\",130,97],[\"x\",\"2d6f36080486bc13a550b438fb0b5a67ca90c318a1f6751d72920dc0\",\"3521653663924479658\",604,453],[\"y\",\"40772f7e6c82ed2209d3079ad2d5d6088a5ba187b3a9ced304a17d92\",\"-1707657353554468079\",640,480],[\"o\",\"5e97d9a7e62e9b6050d09a7f7c777f9038d886933830ee1d56dac76c\",\"6353999654651480154\",130,98],[\"p\",\"479637cc89dde47e05d24536981b896ef94c558e7908142c5a5f0419\",\"-2321896260688822024\",200,150],[\"q\",\"85348b2569931badb60fb05e42aff9e9af943144960b92550f49cf44\",\"370134210341338224\",320,240],[\"r\",\"4177ebc3b128f067d0f8d3c3bbf3cbf8599c0671b15c8fc15ff880d6\",\"-5296072234394386129\",510,383]],\"urls\":[],\"urls2\":[\"L26CsOoPJ4dSHd2ZMH-WDYWxf8fco4TYAtqC2Q/wHSOuJhChHU.jpg\",\"n8IPio9PWCufPO9B0gBXaOntFHrBepD9vRUPjg/jkMNngZCTIA.jpg\",\"LW82CASGvBOlULQ4-wtaZ8qQwxih9nUdcpINwA/quYrTFlt3zA.jpg\",\"QHcvfmyC7SIJ0wea0tXWCIpboYezqc7TBKF9kg/EWNNO68uTeg.jpg\",\"XpfZp-Yum2BQ0Jp_fHd_kDjYhpM4MO4dVtrHbA/Wsh0XgXxLVg.jpg\",\"R5Y3zInd5H4F0kU2mBuJbvlMVY55CBQsWl8EGQ/-MBVIKf3xt8.jpg\",\"hTSLJWmTG622D7BeQq_56a-UMUSWC5JVD0nPRA/cHydbhr7IgU.jpg\",\"QXfrw7Eo8GfQ-NPDu_PL-FmcBnGxXI_BX_iA1g/LwEd1FySgLY.jpg\"]}]","aid":301622171,"hash":"5bc05bbeb62c742eee146afd002ef159","gid":224729248}

// const url = 'https://pu.vk.com/c906128/ss2312/upload.php?act=do_add&mid=66544978&aid=301622171&gid=224729248&hash=8b3e65c5f491c03f9e13856a7f1ea87e&rhash=851313595c67c86b8088bcb066d560a3&swfupload=1&api=1';





// photos.getUploadServer
// Метод получает адрес сервера для загрузки фотографии.
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

// В результате получаем такой ответ:
// let res = {
//     "response": {
//         "album_id": 301622171,
//         "upload_url": "https:\/\/pu.vk.com\/c842528\/ss2089\/upload.php?act=do_add&mid=66544978&aid=301622171&gid=224729248&hash=d38998597c6cfc16cc2b0e6e2dcd3c0b&rhash=962b4d201ba7e481452a9d1ceb02160e&swfupload=1&api=1",
//         "user_id": 66544978
//     }
// }

// Передача файла на сервер.
// photosUpload('https://pu.vk.com/c529436/ss2132/upload.php?act=do_add&mid=66544978&aid=301622171&gid=224729248&hash=8ba2a5f6782091abc277ed79a87f9654&rhash=889e5972b61e96a18123829e5d3c8bca&swfupload=1&api=1');
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
// let res = {
//     "server": 906128,
//     "photos_list": "[{\"markers_restarted\":true,\"photo\":\"48ed6f2e1c:y\",\"sizes\":[],\"latitude\":0,\"longitude\":0,\"kid\":\"71bbc8c5ae72e8e245446075cf159d54\",\"sizes2\":[[\"s\",\"2f6e82b0ea0f2787521ddd99307f960d85b17fc7dca384d802da82d9\",\"8467966423062181056\",75,56],[\"m\",\"9fc20f8a8f4f582b9f3cef41d2005768e9ed147ac17a90fdbd150f8e\",\"-9201907342435859570\",130,97],[\"x\",\"2d6f36080486bc13a550b438fb0b5a67ca90c318a1f6751d72920dc0\",\"3521653663924479658\",604,453],[\"y\",\"40772f7e6c82ed2209d3079ad2d5d6088a5ba187b3a9ced304a17d92\",\"-1707657353554468079\",640,480],[\"o\",\"5e97d9a7e62e9b6050d09a7f7c777f9038d886933830ee1d56dac76c\",\"6353999654651480154\",130,98],[\"p\",\"479637cc89dde47e05d24536981b896ef94c558e7908142c5a5f0419\",\"-2321896260688822024\",200,150],[\"q\",\"85348b2569931badb60fb05e42aff9e9af943144960b92550f49cf44\",\"370134210341338224\",320,240],[\"r\",\"4177ebc3b128f067d0f8d3c3bbf3cbf8599c0671b15c8fc15ff880d6\",\"-5296072234394386129\",510,383]],\"urls\":[],\"urls2\":[\"L26CsOoPJ4dSHd2ZMH-WDYWxf8fco4TYAtqC2Q/wHSOuJhChHU.jpg\",\"n8IPio9PWCufPO9B0gBXaOntFHrBepD9vRUPjg/jkMNngZCTIA.jpg\",\"LW82CASGvBOlULQ4-wtaZ8qQwxih9nUdcpINwA/quYrTFlt3zA.jpg\",\"QHcvfmyC7SIJ0wea0tXWCIpboYezqc7TBKF9kg/EWNNO68uTeg.jpg\",\"XpfZp-Yum2BQ0Jp_fHd_kDjYhpM4MO4dVtrHbA/Wsh0XgXxLVg.jpg\",\"R5Y3zInd5H4F0kU2mBuJbvlMVY55CBQsWl8EGQ/-MBVIKf3xt8.jpg\",\"hTSLJWmTG622D7BeQq_56a-UMUSWC5JVD0nPRA/cHydbhr7IgU.jpg\",\"QXfrw7Eo8GfQ-NPDu_PL-FmcBnGxXI_BX_iA1g/LwEd1FySgLY.jpg\"]}]",
//     "aid": 301622171,
//     "hash": "5bc05bbeb62c742eee146afd002ef159",
//     "gid": 224729248
// }

// photosSave();
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

// "{"response":[{"album_id":301622171,"date":1708610908,"id":457239022,"owner_id":-224729248,"lat":55.173754,"long":61.398793,"sizes":[{"height":56,"type":"s","width":75,"url":"https:\/\/sun9-78.userapi.com\/impg\/QHcvfmyC7SIJ0wea0tXWCIpboYezqc7TBKF9kg\/8MpqaZCQ-QA.jpg?size=75x56&quality=96&sign=5ce8fc2d4470d47b2476eb3324c4f71d&c_uniq_tag=mh8bypLtGUMyS8kul5FLj424UxbsrNfaEvVk0DdUdC0&type=album"},{"height":97,"type":"m","width":130,"url":"https:\/\/sun9-78.userapi.com\/impg\/QHcvfmyC7SIJ0wea0tXWCIpboYezqc7TBKF9kg\/8MpqaZCQ-QA.jpg?size=130x97&quality=96&sign=a1c47f7318a8db68b32f6a019b4445a4&c_uniq_tag=onl5RmDV__Pa1-I21PSmRY5qfe58W9FjbrmlCBsknPs&type=album"},{"height":453,"type":"x","width":604,"url":"https:\/\/sun9-78.userapi.com\/impg\/QHcvfmyC7SIJ0wea0tXWCIpboYezqc7TBKF9kg\/8MpqaZCQ-QA.jpg?size=604x453&quality=96&sign=d7277833dfd681142644771cf87aad37&c_uniq_tag=Z4PpR5CZyRZmXIRncsuTahHZNMMoMEIKYxlmVGr-8Kk&type=album"},{"height":480,"type":"y","width":640,"url":"https:\/\/sun9-78.userapi.com\/impg\/QHcvfmyC7SIJ0wea0tXWCIpboYezqc7TBKF9kg\/8MpqaZCQ-QA.jpg?size=640x480&quality=96&sign=4dc801014da6f27ef3f98b8514b77c1d&c_uniq_tag=qD7HwswSkPpoWmrkY2nEmM9fpY5IBgC88ZVh9vTjlT4&type=album"},{"height":97,"type":"o","width":130,"url":"https:\/\/sun9-78.userapi.com\/impg\/QHcvfmyC7SIJ0wea0tXWCIpboYezqc7TBKF9kg\/8MpqaZCQ-QA.jpg?size=130x97&quality=96&sign=a1c47f7318a8db68b32f6a019b4445a4&c_uniq_tag=onl5RmDV__Pa1-I21PSmRY5qfe58W9FjbrmlCBsknPs&type=album"},{"height":150,"type":"p","width":200,"url":"https:\/\/sun9-78.userapi.com\/impg\/QHcvfmyC7SIJ0wea0tXWCIpboYezqc7TBKF9kg\/8MpqaZCQ-QA.jpg?size=200x150&quality=96&sign=cccb763989216bb83cbd47da5850519f&c_uniq_tag=J821QOndkp7CBOyYxTWfzdeOvR6SGvhQAM03AbdbgVw&type=album"},{"height":240,"type":"q","width":320,"url":"https:\/\/sun9-78.userapi.com\/impg\/QHcvfmyC7SIJ0wea0tXWCIpboYezqc7TBKF9kg\/8MpqaZCQ-QA.jpg?size=320x240&quality=96&sign=393b83be476ff4c88321100a9d2172f4&c_uniq_tag=J7HHegmHxVOAOWyn6hA4IpRj5STFovx-AebQMsnp294&type=album"},{"height":382,"type":"r","width":510,"url":"https:\/\/sun9-78.userapi.com\/impg\/QHcvfmyC7SIJ0wea0tXWCIpboYezqc7TBKF9kg\/8MpqaZCQ-QA.jpg?size=510x382&quality=96&sign=a09953a637f0c9b29356ad57afcf1150&c_uniq_tag=pbO2GSNCGtxyN2QMR2X95poeCn1n2dyYteSvrHGfSfo&type=album"}],"text":"Title title title title \n Цена: 900000₽ \n В наличии в магазине TechnoTrade \n Челябинск, Кирова 62а\/2 \n +7 (951) 116-77-67","user_id":100,"web_view_token":"5ef78a04d65ab35f1d","has_tags":false}]}"
