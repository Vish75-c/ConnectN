import { Router } from "express";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import { searchContacts } from "../controllers/ContactsController.js";

const ContactRoutes=Router();

ContactRoutes.post('/search',verifyToken,searchContacts);

export default ContactRoutes;