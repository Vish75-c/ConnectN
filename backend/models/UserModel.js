import mongoose from "mongoose";
import bcrypt from 'bcrypt'
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is Required"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"password is Required"],
    },
    firstname:{
        type:String,
        required:false,
    },
    lastname:{
        type:String,
        required:false,
    },
    image:{
        type:String,
        required:false,
    },
    color:{
        type:String,
        required:false,
    },
    profileSetup:{
        type:Boolean,
        default:false,
    }
});

userSchema.pre('save',async function(next){
    const person=this;
    if(!person.isModified(password)){
        return next();
    }
    try{
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(hashedPassword,salt);
        person.password=hashedPassword;
        next();

    }catch(err){
        next(err);
    }
})

const User=mongoose.model('users',userSchema);
export default User;