import { Router } from "express";
import { createContact, getContacts } from "../../controller/v1/contact";

export const router = Router();

router.get("/",getContacts);

router.post("/",createContact);
