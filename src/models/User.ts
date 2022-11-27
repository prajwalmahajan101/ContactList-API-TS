import Joi from "joi";
import {compare, hash} from "bcrypt";
import { getConfig } from "../utils/config";
import { getDb } from"../utils/db";
import { sign, verify} from "jsonwebtoken";
import logger from "../utils/logger";
import { ObjectId } from "mongodb";

export const collectionName = "users";

export interface jwtPayload {
    id:string,
    phNumber:string,
    fullName:string
}

export class User{
    id?:string|null;
    fullName:string;
    phNumber:string;
    private password?:string|null;
    createdAt: Date;
    updatedAt:Date;

    constructor(
        id: string | null,
        fullName: string,
        phNumber: string,
        password: string | null,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.fullName = fullName;
        this.phNumber = phNumber;
        this.password = password;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    async #validate():Promise<User>{
        const UserSchema = Joi.object({
            id:Joi.string().allow(null).optional(),
            fullName:Joi.string().required(),
            phNumber:Joi.string().length(10).required(),
            password:Joi.string().required(),
            createdAt:Joi.date().required(),
            updatedAt:Joi.date().required(),
        })
        const validatedData = await UserSchema.validateAsync(this);
        return validatedData as User;
    }

    async register():Promise<User>{
        let validatedUser = await this.#validate();
        let hashedPassword = await hash(
            validatedUser.password!,
            getConfig().secrets.saltRound
        );
        validatedUser.password = hashedPassword;
        delete validatedUser.id;
        let result  = await getDb().collection(collectionName).insertOne(validatedUser);
        if(!result.acknowledged){
            logger.error("User registration failed");
            throw new Error("User registration failed");
        }
        logger.info("User Created")
        this.id = result.insertedId.toHexString()
        delete this.password;
        return this;
    }

    async generateToken():Promise<string>{
        let token:string = sign({
                id:this.id,
                phNumber:this.phNumber,
                fullName:this.fullName
            } as jwtPayload,
            getConfig().secrets.jwtSecret,
            {
                expiresIn:"30d",
            }
        )
        return token
    }

    static async verifyUserAndPassword(
        phNumber: string,
        password: string
    ):Promise<User>{
        let result = await getDb().collection(collectionName).findOne({
            phNumber,
        });
        if(!result){
            logger.info(`User Not Found with phone number : ${phNumber}`);
            throw new Error("User Not Found");
        }
        let user = new User(
            result._id.toHexString(),
            result.fullName,
            result.phNumber,
            result.password,
            result.createdAt,
            result.updatedAt
        )
        let isValid = await compare(password,user.password!);
        if (! isValid){
            logger.info("Invalid Password");
            throw new Error("Invalid Password");
        }
        delete user.password;
        return user;
    }
    static async validateToken(token : string):Promise<jwtPayload>{
        let decodedToken = await verify(token,getConfig().secrets.jwtSecret);
        return decodedToken as jwtPayload;
    }
    static async deleteUser(id:string){
        let user = getDb().collection(collectionName).findOneAndDelete({_id:new ObjectId(id)});
        return user;
    }
    static async getUserById(id:string){
        let user = getDb().collection(collectionName).findOne({_id:new ObjectId(id)},{
            projection:{
                password:0
            }
        });
        return user;
    }

}