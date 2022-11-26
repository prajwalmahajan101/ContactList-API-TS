import  configModule from "config";
import Joi from "joi";
import logger from "./logger";


export interface AppConfig {
    port: number,
    db:{
        url: string,
        dbName: string
    },
    secrets:{
        jwtSecret: string,
        saltRound: number
    }
}

let config = null as AppConfig | null;

const appConfig = Joi.object({
    port:Joi.number().default(8000).optional(),
    db:Joi.object({
        url: Joi.string().required(),
        dbName: Joi.string().required()
    }),
    secrets:Joi.object({
        jwtSecret: Joi.string().required(),
        saltRound: Joi.number().required()
    }).required()
})

export const loadConfig = async () =>{
    try{
        logger.info("Loading Configuration");
        let appSettings = configModule.get('app') || {};
        config = await appConfig.validateAsync(appSettings);
    }
    catch(e){
        throw e
    }
}
export const getConfig = () =>{
    if (!config){
        logger.error("Config is not loaded")
        throw new Error("Config is not loaded")
    }
    return config;
}

export default config;

