import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import db from './db.js';
import authRoutes from './routes/AuthRoutes.js';


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
app.use('/api/auth',authRoutes);
app.listen(port,()=>{
    console.log(`server running on the port ${port}`)
})