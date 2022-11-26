import { Router } from "express";
import { router as v1Router } from "./vi";
import { health } from "../controller/healthcontroller";

export const router = Router();

router.get("/health",health)
router.use("v1",v1Router)

