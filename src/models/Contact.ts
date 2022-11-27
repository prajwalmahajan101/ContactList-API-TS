import { getDb } from "../utils/db";
import logger from "../utils/logger";
import Joi from "joi";

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
        let result = await getDb().collection(collectionName).insertOne(this);
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
        contacts.map(el=>{
            el.id = el._id;
            return el;
        })
        return contacts;
    }

}