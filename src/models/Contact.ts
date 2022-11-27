import { getDb } from "../utils/db";
import logger from "../utils/logger";
import Joi from "joi";
import { ObjectId } from "mongodb";
export const collectionName = "Contact";

export class Contact{
    id?:string| null;
    fullName:string;
    phNumber:string;
    user:string;

    constructor(id: string | null, fullName: string, phNumber: string, user: string) {
        this.id = id;
        this.fullName = fullName;
        this.phNumber = phNumber;
        this.user = user;
    }

    async #validate():Promise<Contact>{
        const ContactSchema = Joi.object({
            id:Joi.string().allow(null).optional(),
            fullName:Joi.string().required(),
            phNumber:Joi.string().required(),
            user:Joi.string().required()
        })
        const validatedContact = await ContactSchema.validateAsync(this);
        return validatedContact as Contact;
    }

    async register():Promise<Contact>{
        let ValidContact = await this.#validate();
        delete ValidContact.id;
        let result = await getDb().collection(collectionName).insertOne(ValidContact);
        if (!result.acknowledged){
            logger.error("Error while Creating Contact");
            throw new Error("Error while Creating Contact");
        }
        this.id = result.insertedId.toHexString();
        return this;
    }

    static async getContacts(query:object):Promise<any>{
        let contacts = await getDb().collection(collectionName).find(
            query,
            {
                projection:{
                    user:0,
                },
            }
        ).toArray();
        return contacts;
    }

    static async getContactById(user:string,_id:string):Promise<any>{
        let contact = await getDb().collection(collectionName).findOne({user,_id:new ObjectId(_id)})
        console.log(contact)
        return contact;
    }
    static async deleteContactByIDs(user:string,ids:[string]):Promise<any>{
        let deleteIDs = ids.map(el=>new ObjectId(el));
        let contacts = await getDb().collection(collectionName).deleteMany({
            user,
            _id:{
                $in:deleteIDs
            }
        })
        console.log(contacts);
        return contacts;
    }

    static async editContactById(user:string,id:string,body:Object){
        let contact = await getDb().collection(collectionName).findOneAndUpdate(
            {user,_id:new ObjectId(id)},
            {"$set": body},
            { returnDocument:"after"}
        )
        return contact;

    }

    static async deleteAllcontactOfUser(user:string){
        let deleted = await getDb().collection(collectionName).deleteMany({user});
        return deleted;
    }

}