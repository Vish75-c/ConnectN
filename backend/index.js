import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import db from './db.js';
dotenv.config();

const app=express();
const port=process.env.port||3001;
const database=process.env.DATABASE_URL;
app.use(cors({
    origin:[process.env.ORIGIN],
    methods:["GET","POST","PUT","PATCH","DELETE"],
    credentials:true
}))
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.get('/',(req,res)=>{
    res.send("Running");
})

app.listen(port,()=>{
    console.log(`server running on the port ${port}`)
})