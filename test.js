'use strict'; 
import dbTechnoTrade from "./db/dbTechnoTrade.js";
const dbTT = dbTechnoTrade();

console.log(await dbTT.getProductsListByStatus('low'));