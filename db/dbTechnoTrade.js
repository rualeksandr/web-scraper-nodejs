'use strict';
import dbService from "./dbService.js";
import { DB_CONNECT } from "../token_private.js";
const db = dbService(DB_CONNECT.url);

export default function dbTechnoTrade() {
    const getProductsListByStatus = async (status) => {
        if(status === "low" || status === "high" || status === "removal") {
            const res = await db.find(DB_CONNECT.dbName, DB_CONNECT.collectionName, {"status": status});
            return res;
        } else {
            return new Error(`В метод getProductsListByStatus() пришел неизвестный статус: ${status}.`);
        }
    };
    const updateOneProductByAvitoID = async (avito_id, product) => {
            const filter = { 'id_avito': avito_id };
            const update = { $set: product };
            const options = {};
            const res = await db.updateOne(DB_CONNECT.dbName, DB_CONNECT.collectionName, filter, update, options);
            return res;
    }

    return {
        getProductsListByStatus,
        updateOneProductByAvitoID
    }
}

console.log(typeof(typeof({})))