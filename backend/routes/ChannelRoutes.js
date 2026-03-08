import Router from 'express';
import { verifyToken } from "../middleware/AuthMiddleware.js";
import { createChannel } from '../controllers/ChannelController.js';


const channelRoutes=Router();
channelRoutes.post('/create-channel',verifyToken,createChannel)

export default channelRoutes;