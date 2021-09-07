import * as mongoDB from "mongodb";
import { Collection } from "mongodb";

require('dotenv').config();

export interface MongoAPI{
    collections: Map<string, mongoDB.Collection>,
    init: () => void,
    get: (collection: string, filter: mongoDB.Filter<mongoDB.Document>) => Promise<any[]>
    getOne: (collection: string, filter: mongoDB.Filter<mongoDB.Document>) => any,
    addItem: (collection: string, item: any) => Promise<mongoDB.ObjectId>
    updateItem: (id: string, collection: string, item: any) => Promise<boolean>
}

interface Settings{
    DB_CONN_STRING: string,
    DB_NAME: string,
    SETTINGS_COLLECTION_NAME: string
}

const mongoAPI: MongoAPI = module.exports = {
    collections: new Map<string, mongoDB.Collection>(),
    init: () => {
        const {DB_CONN_STRING, DB_NAME, SETTINGS_COLLECTION_NAME}: Settings = (process.env) as unknown as Settings

        if (!DB_CONN_STRING) throw new Error('Missing DB connection string');
        if (!DB_NAME) throw new Error("Missing DB name");
        if (!SETTINGS_COLLECTION_NAME) throw new Error("Missing Settings Collection Name");
        
        const client: mongoDB.MongoClient = new mongoDB.MongoClient(DB_CONN_STRING);
        client.connect().then(() => {
            const db: mongoDB.Db = client.db(DB_NAME);  
            //add collections
            mongoAPI.collections.set(SETTINGS_COLLECTION_NAME, db.collection(SETTINGS_COLLECTION_NAME));
            console.log(`Successfully connected to database: ${db.databaseName}`);
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

