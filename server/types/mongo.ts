import {Collection, MongoClient, Db } from "mongodb";

export interface MongoAPI{
    collections: Map<string, Collection>,
    client: MongoClient,
    db: Db | null,
    init: () => void,
}

export interface ENV{
    DB_CONN_STRING: string,
    DB_NAME: string,
    SETTINGS_COLLECTION_NAME: string
    ROUND_COLLECTION_NAME: string
}