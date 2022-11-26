import { Request , Response } from "express";

export const testing = (req:Request,res:Response)=>{
    return res.status(200).json({
        msg:"Hello World from API-TS"
    })
}