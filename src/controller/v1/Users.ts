import {NextFunction, Request, Response} from "express";
import { User } from "../../models/User";
import logger from "../../utils/logger";

export const create = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        let {fullName, phNumber, password} = req.body;
        let user = new User(null, fullName, phNumber, password, new Date(), new Date());
        const createdUser: User = await user.register();
        res.status(201).json({
            msg: "User Created !!!",
            user: createdUser
        });
    }catch(err){
        logger.error(`Error occurred while creating the user ${err}`)
        next(err);
    }
}
export const login = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const { phNumber, password } = req.body;
        let user = await User.verifyUserAndPassword(phNumber, password);
        let token = await user.generateToken();
        res.status(200).json({
            msg: "User Logged in",
            data: {
                token,
                user,
            }
        })
    }catch(err){
        logger.error(`User`)
        next(err);
    }

}