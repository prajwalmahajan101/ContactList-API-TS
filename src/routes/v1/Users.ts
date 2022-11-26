import { Router } from "express";
import { create,login } from "../../controller/v1/Users";

export const router = Router();

router.post("/",create)
router.post("/login",login)
