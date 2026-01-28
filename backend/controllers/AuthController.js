import User from "../models/UserModel";
const maxAge=3*24*60*60*1000;
import {jwt} from 'jsonwebtoken'
const createToken=(email,userId)=>{
    return jwt.sign({email,userId},process.env.JWT_KEY,{expiresIn:maxAge});
}

export const signup=async (request,response,next)=>{
    try {
        const {email,password}=request.body;
        if(!email||!response){
            return response.status(400).send('Email and Password is Required');
        }
        const user=new User();
        const response=await user.save();
        response.cookie('jwt',createToken(email,response._id),{
            maxAge,
            secure:true,
            sameSite:'None'
        })
        return response.status(200).json(response)
    } catch (error) {
        return response.status(500).send("Internal Server Error");
    }
}