import { Request, Response,NextFunction } from "express";
import { User,jwtPayload } from "../models/User";
import logger from "../utils/logger";
import {customError} from "./Error";

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
            let error = new customError("No token Provided",400);
            next(error);
        }
        let payLoad:jwtPayload = await User.validateToken(token as string);
        let user =  await User.getUserById(payLoad.id);
        if(!user) {
            next(new customError("User already Deleted",404))
        }
        req.userId = payLoad.id;
        req.userFullName = payLoad.fullName;
        req.userPhNumber = payLoad.phNumber;
        next();
    }
    catch(err){
        next(err);
    }
}