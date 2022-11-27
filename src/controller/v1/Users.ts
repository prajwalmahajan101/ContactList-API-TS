import {NextFunction, Request, Response} from "express";
import { User } from "../../models/User";
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
        next(err);
    }

}


export const deleteUser = async  (req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
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

export const getLoggedInUser = async  (req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
    try {
        let userId = req.userId as string;
        let user = await User.getUserById(userId);
        res.status(200).json({
            msg:"Logged In User fetched",
            user
        })

    }catch(e){
        next(e)
    }
}