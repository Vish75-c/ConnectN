import { Router } from "express";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import { getContactFromDMList, searchContacts } from "../controllers/ContactsController.js";

const ContactRoutes=Router();

ContactRoutes.post('/search',verifyToken,searchContacts);
ContactRoutes.get('/get-contacts-for-dm',verifyToken,getContactFromDMList);
export default ContactRoutes;