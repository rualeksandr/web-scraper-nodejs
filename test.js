'use strict'; 
import dbService from './api/bdService.js';
import { DB_CONNECT } from './token_private.js';

const db = dbService(DB_CONNECT.url);

async function databaseFind() {
    const res = await db.find(DB_CONNECT.dbName, DB_CONNECT.collectionName, {"status": "low"});
    
    return res;
}

databaseFind().then(function(result) {
    console.log(result) // "Some User token"
 })
