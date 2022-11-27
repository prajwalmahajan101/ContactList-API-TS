import { Contact } from "../../models/Contact";
import { Response,NextFunction } from "express";
import { AuthenticatedRequest } from "../../middleware/isAuth";

interface Query{
    user?:string,
    fullName?:Object,
    phNumber?:Object
}


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
        next(err);
    }
}

export const getContacts = async (req:AuthenticatedRequest,res:Response,next:NextFunction) =>{
    try{
        const user = req.userId as string;
        const query:Query = { user };
        const { fullName, phNumber } = req.query;
        if(fullName){
            query['fullName']  ={
                "$regex":fullName,
                '$options' : 'i'
            }
        }
        if(phNumber){
            query['phNumber']  = {
                "$regex":phNumber,
            }
        }
        // console.log(query)
        const contacts = await Contact.getContacts(query);
        res.status(200).json({
            msg:"Contacts Fetched",
            contacts
        })
    }catch(err){
        next(err);
    }
}

export const getContactByID = async (req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
    try{
        const id = req.params.id as string;
        const user = req.userId as string;
        const contact = await Contact.getContactById(user,id);
        res.status(200).json({
            msg:"Contact Fetched",
            contact
        })

    }catch(err){
        next(err);
    }
}


export const deleteContactById =async (req:AuthenticatedRequest,res:Response,next:NextFunction) =>{
    try{
        const id = req.params.id as string;
        const user = req.userId as string;
        const ids = [id] as [string];
        const contact = await Contact.deleteContactByIDs(user,ids)
        res.status(200).json({
            msg:"Contact Deleted",
            contact
        })

    }catch(err){
        next(err);
    }

}

export const deleteContactByIDs = async (req:AuthenticatedRequest,res:Response,next:NextFunction) =>{
    try{
        const user = req.userId as string;
        const ids = req.body.ids;
        const contact = await Contact.deleteContactByIDs(user,ids)
        res.status(200).json({
            msg:"Contact Deleted",
            contact
        })
    }catch(err){
        next(err);
    }
}


export const editContactById = async (req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
    try{
        const user = req.userId as string;
        const id = req.params.id as string;
        const { fullName, phNumber } = req.body;
        const body:Query = {};
        if( fullName ){
            body['fullName'] = fullName;
        }
        if(phNumber){
            body['phNumber'] = phNumber;
        }
        const contact = await Contact.editContactById(user,id,body);
        res.status(200).json({
            msg:"Contact Edited",
            contact,
        })

    }catch(err){
        next(err);
    }
}