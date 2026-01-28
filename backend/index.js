import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import db from './db.js';
dotenv.config();

const app=express();
const port=process.env.port||3001;
const database=process.env.DATABASE_URL;

app.get('/',(req,res)=>{
    res.send("Running");
})

app.listen(port,()=>{
    console.log(`server running on the port ${port}`)
})