import {Router} from "express";

import { router as UserRouter } from "./Users";

export const router = Router();
router.use("/users",UserRouter)
