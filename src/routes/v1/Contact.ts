import { Router } from "express";
import {
    createContact,
    getContacts,
    getContactByID,
    deleteContactById,
    deleteContactByIDs,
    editContactById
} from "../../controller/v1/contact";

export const router = Router();

router.get("/",getContacts);
router.get("/:id",getContactByID);
router.delete("/:id",deleteContactById);
router.patch("/:id",editContactById);

router.delete("/",deleteContactByIDs);

router.post("/",createContact);
