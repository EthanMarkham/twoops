import * as mongoDB from "mongodb";
import { Collection } from "mongodb";

require('dotenv').config();

export interface MongoAPI{
    collections: Map<string, mongoDB.Collection>,
    client: mongoDB.MongoClient,
    db: mongoDB.Db | null,
    init: () => void,
    get: (collection: string, filter: mongoDB.Filter<mongoDB.Document>) => Promise<any[]>
    getOne: (collection: string, filter: mongoDB.Filter<mongoDB.Document>) => any,
    addItem: (collection: string, item: any) => Promise<mongoDB.ObjectId>
    updateItem: (id: string, collection: string, item: any) => Promise<boolean>
}

interface ENV{
    DB_CONN_STRING: string,
    DB_NAME: string,
    SETTINGS_COLLECTION_NAME: string
    ROUND_COLLECTION_NAME: string
}

const {DB_CONN_STRING, DB_NAME, SETTINGS_COLLECTION_NAME, ROUND_COLLECTION_NAME}: ENV = (process.env) as unknown as ENV

if (!DB_CONN_STRING || !DB_NAME || !SETTINGS_COLLECTION_NAME || !ROUND_COLLECTION_NAME) throw new Error('Missing DB connection settings. Check ENV vars.');

const mongoAPI: MongoAPI = module.exports = {
    client: new mongoDB.MongoClient(DB_CONN_STRING),
    db: null,
    collections: new Map<string, mongoDB.Collection>(),
    init: () => {
        mongoAPI.client.connect().then(() => {
            mongoAPI.db = mongoAPI.client.db(DB_NAME);  
            //add collections
            mongoAPI.collections.set(ROUND_COLLECTION_NAME, mongoAPI.db.collection(ROUND_COLLECTION_NAME));
            mongoAPI.collections.set(SETTINGS_COLLECTION_NAME, mongoAPI.db.collection(SETTINGS_COLLECTION_NAME));
            console.log(`Successfully connected to database: ${mongoAPI.db.databaseName}`);
        });
    },
    get: (collection: string, filter: mongoDB.Filter<mongoDB.Document> = {}) => {
        return new Promise<any[]>(async (resolve) => {
            let dbCollection: Collection | undefined = mongoAPI.collections.get(collection);
            if (dbCollection == undefined) throw new Error(`DB collection "${collection}" not found`);

            const results: mongoDB.FindCursor<mongoDB.Document> = await dbCollection.find(filter)
            resolve(results.toArray());
        })
    },
    getOne: (collection: string, filter: mongoDB.Filter<mongoDB.Document> = {}) => {
        return new Promise<any>(async (resolve) => {
            let dbCollection: Collection | undefined = mongoAPI.collections.get(collection);
            if (dbCollection == undefined) throw new Error(`DB collection "${collection}" not found`);

            dbCollection.findOne(filter)
            .then((doc: any) => resolve(doc))
            .catch(err => { throw new Error(`Error Fetching Document. ${err.message}`)})
        })
    },
    addItem: (collection: string, item: any) => {
        return new Promise<mongoDB.ObjectId >(async (resolve, reject) => {
            let dbCollection: Collection | undefined = mongoAPI.collections.get(collection);
            if (dbCollection == undefined) throw new Error(`DB collection "${collection}" not found`);

            const result: mongoDB.InsertOneResult = await dbCollection.insertOne(item);
            resolve(result.insertedId);
        })
    },
    updateItem: (collection: string, item: any, id: string) => {
        return new Promise<boolean>(async (resolve) => {
           
            resolve(Boolean(true));
        })
    }
}

