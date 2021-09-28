import { MongoClient, Collection } from "mongodb";
import { DAO, ENV, MongoAPI } from "../types/mongo";

require("dotenv").config();

const {
    DB_CONN_STRING,
    DB_NAME,
    SETTINGS_COLLECTION_NAME,
    ROUND_COLLECTION_NAME,
}: ENV = process.env as unknown as ENV;

if (
    !DB_CONN_STRING ||
    !DB_NAME ||
    !SETTINGS_COLLECTION_NAME ||
    !ROUND_COLLECTION_NAME
)
    throw new Error("Missing DB connection settings. Check ENV vars.");

const mongoAPI: MongoAPI = (module.exports = {
    client: new MongoClient(DB_CONN_STRING),
    db: null,
    collections: new Map<string, Collection>(),
    dao: [],
    init(callback?: () => void) {
        mongoAPI.client.connect().then(() => {
            mongoAPI.db = mongoAPI.client.db(DB_NAME);
            //add collections
            mongoAPI.collections.set(
                ROUND_COLLECTION_NAME,
                mongoAPI.db.collection(ROUND_COLLECTION_NAME)
            );
            mongoAPI.collections.set(
                SETTINGS_COLLECTION_NAME,
                mongoAPI.db.collection(SETTINGS_COLLECTION_NAME)
            );


            console.log(
                `Successfully connected to database: ${mongoAPI.db.databaseName}`
            );
            callback && callback();
        });
    },
    addDAO(dao: DAO) {
        mongoAPI.dao.push(dao);
        dao.setCollections();
    },
});
