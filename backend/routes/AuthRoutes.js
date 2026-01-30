import { Router } from "express";
import { login, signup } from "../controllers/AuthController.js";
import { getUserInfo } from "../controllers/AuthController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import { updateProfile } from "../controllers/AuthController.js";
const authRoutes=Router();

authRoutes.post('/signup',signup)
authRoutes.post('/login',login);
authRoutes.get('/userInfo',verifyToken,getUserInfo);
authRoutes.post('/update-profile',verifyToken,updateProfile)
export default authRoutes;