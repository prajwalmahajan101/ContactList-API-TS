import {Router} from "express";
import {testing} from "../../controller/v1/Users";

export const router = Router();

router.get("/",testing)
