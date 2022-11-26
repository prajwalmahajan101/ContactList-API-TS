import { Request, Response,NextFunction } from "express";
import { User,jwtPayload } from "../models/User";
import logger from "../utils/logger";

export interface AuthenticatedRequest extends Request{
    userId?: string
    userPhNumber?: string
    userFullName?: string
}

export const isAuth = async (req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
    try{
        let token = req.headers.authorization?.split(" ")[1];
        if(!token){
            logger.info("No token Provided");
            let error = new Error("No token Provided");
            next(error);
        }
        let payLoad:jwtPayload = await User.validateToken(token as string);
        req.userId = payLoad.id;
        req.userFullName = payLoad.fullName;
        req.userPhNumber = payLoad.phNumber;
        next();
    }
    catch(err){
        next(err);
    }
}