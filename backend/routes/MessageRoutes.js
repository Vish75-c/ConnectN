import { Router } from "express";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import { getMessages } from "../controllers/MessageController.js";

const messageRoutes=Router();

messageRoutes.post('/get-messages',verifyToken,getMessages);


export default messageRoutes;