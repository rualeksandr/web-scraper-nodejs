import { MongoClient, ServerApiVersion } from 'mongodb';
import { DB_CONNECT } from './token_private.js';

const client = new MongoClient(DB_CONNECT.url, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

export async function updateProductsArray(productsArray) {
    try {
        await client.connect();
        console.log("Успешно подключились к MongoDB!");
        const database = client.db(DB_CONNECT.dbName);
        const collection = database.collection(DB_CONNECT.collectionName);
        try {
            const data = {
                newIds: [],
                existingIds: [],
                deletedIds: [],
            }
            const dbProducts = await collection.find({}).toArray();
            for (const product of productsArray) {
                const id_avito = product.id_avito;
                const existingProduct = dbProducts.find(dbProduct => dbProduct.id_avito === id_avito);
                if (existingProduct) {
                    data.existingIds.push(id_avito);
                } else {
                    data.newIds.push(id_avito);
                    product.status = 'low';
                    await collection.insertOne(product);
                }
            }
            for (const dbProduct of dbProducts) {
                if (!productsArray.find(product => product.id_avito === dbProduct.id_avito)) {
                    let delId = dbProduct.id_avito;
                    data.deletedIds.push(delId);
                    await collection.updateOne({ 'id_avito': delId }, { $set: { status: 'removal' } });
                }
            }
            return data;
        } catch (err) {
            console.error(`Что-то пошло не так при попытке вставить новые документы: ${err}\n`);
            return {};
        }
    } finally {
        await client.close();
        console.log("Закрыли подключение к MongoDB!");
    }
}