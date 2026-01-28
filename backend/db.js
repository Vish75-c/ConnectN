import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();

const database_url=process.env.DATABASE_URL;
console.log(database_url)
mongoose.connect(database_url)
const db=mongoose.connection;
db.on('connected',()=>{
    console.log("Database is connected")
})
db.on('error',()=>{
    console.log("Error Connecting database");
})
db.on('disconnected',()=>{
    console.log("Database Disconnected")
})

export default db