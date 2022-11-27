import { Router } from "express";
import {create, deleteUser, login} from "../../controller/v1/Users";
import {isAuth} from "../../middleware/isAuth";

export const router = Router();

router.post("/",create)
router.post("/login",login)

router.delete("/",isAuth,deleteUser)
