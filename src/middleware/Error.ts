import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
export class customError extends Error{
    statusCode:number;
    constructor(msg:string,code:number|null) {
        super(msg);
        this.statusCode = code ? code : 500;
    }
}

export const errorHandler = (err:customError,req:Request,res:Response,next:NextFunction) =>{
    logger.error(err.message);
    res.status(err.statusCode?err.statusCode:500).json({
        error : err.message
    })
}