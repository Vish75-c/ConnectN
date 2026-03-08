import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import db from './db.js';
import authRoutes from './routes/AuthRoutes.js';
import ContactRoutes from './routes/ContactRoutes.js';
import { setupSocket } from './socket.js';
import messageRoutes from './routes/MessageRoutes.js';
import channelRoutes from './routes/ChannelRoutes.js';

dotenv.config();

const app=express(); 
const port=process.env.port||3001;
const database=process.env.DATABASE_URL;
app.use(
  cors({ 
    origin: "http://localhost:5173", // Vite frontend
    credentials: true,               // REQUIRED for cookies/JWT
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use('/uploads/profiles',express.static('uploads/profiles'));



app.use(cookieParser()); 
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.get('/',(req,res)=>{
    res.send("Running");
})
app.use('/api/contacts',ContactRoutes)
app.use('/api/auth',authRoutes);
app.use('/api/messages',messageRoutes)
app.use('/api/channel',channelRoutes)
const server=app.listen(port,()=>{
    console.log(`server running on the port ${port}`)
})

setupSocket(server);