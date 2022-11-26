import { Contact } from "../../models/Contact";
import { Response,NextFunction } from "express";
import { AuthenticatedRequest } from "../../middleware/isAuth";
import logger from "../../utils/logger";

export const createContact = async (req:AuthenticatedRequest,res:Response,next:NextFunction) =>{
    try{
        const { fullName, phNumber } = req.body;
        const user = req.userId as string;
        const contactData = new Contact(null,fullName,phNumber,user);
        const contact = await contactData.register();
        res.status(200).json({
            msg:"Contact Created",
            contact
        })
    }catch(err){
        logger.error(err);
        next(err);
    }
}

export const getContacts = async (req:AuthenticatedRequest,res:Response,next:NextFunction) =>{
    try{
        const user = req.userId as string;
        const contacts = await Contact.getContacts(user);
        res.status(200).json({
            msg:"Contacts Fetched",
            contacts
        })
    }catch(err){
        next(err);
    }
}