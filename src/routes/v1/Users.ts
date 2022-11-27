import { Router } from "express";
import {create, deleteUser, getLoggedInUser, login} from "../../controller/v1/Users";
import {isAuth} from "../../middleware/isAuth";

export const router = Router();

router.get("/",isAuth,getLoggedInUser)
router.post("/",create)
router.post("/login",login)

router.delete("/",isAuth,deleteUser)
