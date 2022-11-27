import { Router } from "express";
import {create, deleteUser, getLoggedInUser, login, resetPassword, updateProfile} from "../../controller/v1/Users";
import {isAuth} from "../../middleware/isAuth";

export const router = Router();

router.get("/",isAuth,getLoggedInUser)

router.post("/",create)
router.post("/login",login)

router.patch("/",isAuth,updateProfile)
router.patch("/reset_password",isAuth,resetPassword)


router.delete("/",isAuth,deleteUser)
