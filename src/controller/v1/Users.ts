import {NextFunction, Request, Response} from "express";
import { User } from "../../models/User";
import logger from "../../utils/logger";
import {AuthenticatedRequest} from "../../middleware/isAuth";
import {Contact} from "../../models/Contact";

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


export const deleteUser =async  (req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
    try {
        const contactedDeleted = await Contact.deleteAllcontactOfUser(req.userId as string);
        const deleted = await User.deleteUser(req.userId as string);

        return res.status(200).json({
            msg:"User deleted",
            contactedDeleted,
            deleted
        })

    }catch(err){
        next(err);
    }
}