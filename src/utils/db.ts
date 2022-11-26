import { Db, MongoClient } from "mongodb";
import { getConfig } from "./config";
import logger from "./logger";

import  { collectionName as UserCollectionName } from "../models/User";

let db:Db;

export const establishConnection = async ():Promise<void>=>{
    try{
        const url = getConfig().db.url;
        const dbName = getConfig().db.dbName;
        if( url == null || url == "" || dbName ==null || dbName == "" ) {
            logger.error("Mongo URL or DB Name not Set");
            throw new Error("Mongo URL or DB Name not Set");
        }
        const client = new MongoClient(
            url,
            {
                minPoolSize: 10,
                maxPoolSize: 25
            }
        )
        const clientConnection = await client.connect();
        logger.info("Database connection is established");
        db = clientConnection.db(dbName);
        await db.collection(UserCollectionName).createIndex({phNumber: 1}, {unique: true});
    }catch(e){
        logger.error("Error connecting to the database",e);
        throw e;
    }
}

export const getDb = ():Db =>{
    if (db) {
        return db;
    }
    else{
        logger.error("Db connection is Inactive");
        throw new Error("Db connection is Inactive");
    }
}
