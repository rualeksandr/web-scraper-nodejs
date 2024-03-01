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
            return new Error(`В метод getProductsListByStatus() пришел неизвестный статус: ${status}`);
        }
    }

    return {
        getProductsListByStatus
    }
}
