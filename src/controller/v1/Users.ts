import {NextFunction, Request, Response} from "express";
import { User } from "../../models/User";
import {AuthenticatedRequest} from "../../middleware/isAuth";
import {Contact} from "../../models/Contact";
import {customError} from "../../middleware/Error";

interface ProfileUpdateBody{
    phNumber?:string|null,
    fullName?:string|null
}


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

export const getLoggedInUser = async (req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
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

export const updateProfile = async (req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
    try {
        let userId = req.userId as string;
        const { fullName, phNumber } = req.body;
        let body:ProfileUpdateBody = {};
        if(fullName){
            body.fullName = fullName;
        }
        if(phNumber){
            body.phNumber = phNumber;
        }
        if(!phNumber && !fullName){
            next (new customError("Require some Body to update User",400));
        }
        let updatedUser = await User.updateProfile(userId,body);
        res.status(200).json({
            msg:"User Updated",
            updatedUser
        })

    }catch(e){
        next(e)
    }
}

export const resetPassword = async (req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
    try {
        let userId = req.userId as string;
        const { password, newPassword } = req.body;
        if(!newPassword){
            next(new customError("NewPassword Not Found",400))
        }
        let user = await User.resetPassword(userId,password,newPassword);
        return res.status(200).json({
            msg:"Password Changed",
            user
        })
    }catch(e){
        next(e)
    }
}