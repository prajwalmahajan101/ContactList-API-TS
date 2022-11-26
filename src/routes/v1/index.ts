import {Router} from "express";

import { router as UserRouter } from "./Users";
import { router as ContactRouter } from "./Contact";
import { isAuth } from "../../middleware/isAuth";


export const router = Router();
router.use("/users",UserRouter)
router.use("/contacts",isAuth,ContactRouter);
