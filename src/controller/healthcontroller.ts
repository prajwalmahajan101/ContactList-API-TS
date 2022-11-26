import { Request , Response, NextFunction } from "express";

export const health = (req:Request,res:Response,next:NextFunction)=>{
    res.status(200).json({
        msg:"APIs Are working fine"
    })
}