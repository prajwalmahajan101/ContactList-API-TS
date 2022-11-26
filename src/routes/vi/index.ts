import {Router} from "express";
import { health } from "../../controller/healthcontroller";

export const router = Router();

router.get("/",health)
