import Channel from "../models/ChannelModel.js";
import channel from "../models/ChannelModel.js";
import User from "../models/UserModel.js";
import mongoose from "mongoose";
export const createChannel=async (req,res)=>{
    try {
        const {name,members}=req.body;
        const userId=req.user;
        const admin=await User.findById(userId)
        if(!admin){
            return res.status(400).send("Admin user not found");
        }
        const validMembers=await User.find({_id:{$in:members}});
        if(validMembers.length!==members.length){
            return res.status(400).send("Some member are not valid users");
        }
        
        const newChannel=new channel({
            name,
            members,
            admin:userId,

        })
        await newChannel.save();
        return res.status(200).json({channel:newChannel});
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}

export const getUserChannels=async (req,res)=>{
    try {
        
        const userId=new mongoose.Types.ObjectId(req.user);
        const channels=await channel.find({
            $or:[{admin:userId},{members:userId}]
        }).sort({updatedAt:-1});

        return res.status(200).json({channels});
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server error");
    }
}

export const getChannelMessages=async (req,res)=>{
    try {
        const {channelId}=req.params;
        const channel=await Channel.findById(channelId).populate({path:"messages",populate:{
            path:"sender",select:"firstName lastName email _id image color"
        }})
        if(!channel){
            return res.status(400).send("Channel not found");
        }
        const messages=channel.messages;
        return res.status(200).json({messages});
    } catch (error) {
        
    }
}