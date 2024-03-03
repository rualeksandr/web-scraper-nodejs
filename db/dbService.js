import { MongoClient, ServerApiVersion } from 'mongodb';

export default function dbService(url) {
    const client = new MongoClient(url, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
    });
    const find = async (dbName, collectionName, query, projection, options) => {
        try {
            await client.connect();
            const database = client.db(dbName);
            const collection = database.collection(collectionName);
            const res = await collection.find(query, projection, options).toArray();
            return res;
        } finally {
            await client.close();
        }
    };
    const updateOne = async (dbName, collectionName, filter, update, options) => {
        try {
            await client.connect();
            const database = client.db(dbName);
            const collection = database.collection(collectionName);
            const res = await collection.updateOne(filter, update, options);
            return res;
        } finally {
            await client.close();
        }
    };

    return {
        find,
        updateOne
    }
}
