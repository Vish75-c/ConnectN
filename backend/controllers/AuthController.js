import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
const jwtMaxAge = 3 * 24 * 60 * 60; // seconds
const cookieMaxAge = jwtMaxAge * 1000;

const createToken = (email, userId) => {
  return jwt.sign(
    { email, userId },
    process.env.JWT_KEY,
    { expiresIn: jwtMaxAge }
  );
};

export const signup = async (req, res) => {
  try {
    
    const { email, password } = req.body;
    console.log(req.body);

    if (!email || !password) {
      return res.status(400).send("Email and Password is Required");
    }

    const user = new User({ email, password });

    const savedUser = await user.save();
    res.cookie("jwt", createToken(email, savedUser._id), {
      maxAge: cookieMaxAge,
      httpOnly: true,
      secure: false, // localhost
      sameSite: "Lax",
    });

    return res.status(201).json(savedUser);

  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).send("Internal Server Error");
  }
};

export const login=async (req,res)=>{
  try {
    console.log("visited");

    const {email,password}=req.body;
    if(!email||!password)return res.status(400).send("Email and Password is required");

    const user=await User.findOne({email:email});
    console.log(user);
    if(!user)return res.status(404).send("User Not found");
    
    const isMatch=await bcrypt.compare(password,user.password);
    console.log(isMatch);
    if(isMatch){
      res.cookie("jwt", createToken(email, user._id), {
      maxAge: cookieMaxAge,
      httpOnly: true,
      secure: false, // localhost
      sameSite: "Lax",
    });
      return res.status(201).json(user);
    }else{
      return res.status(401).send("Invalid Password Entered");
    }
    
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).send("Internal Server Error");
  }
}

export const getUserInfo=async(req,res)=>{
  try {
    // console.log(req.user,"Visited");
    const userData=await User.findById(req.user);
    if(!userData){
      return response.status(404).send("User not found");
    }
    res.status(200).json(userData);
  } catch (error) {
    return res.status(401).send("User with the given id not found");
  }
}

export const updateProfile=async(req,res)=>{
  try {
    const userId=req.user;
    const {firstName,lastName,color}=req.body;
    if(!firstName||!lastName){
      return response.status(400).send("Firstname lastname and color is required");
    }
    const userData=await User.findByIdAndUpdate(userId,{firstName,lastName,color,profileSetup:true},{new:true,runValidators:true});
    return res.status(200).json(userData);
  } catch (error) {
    return res.status(401).send("User with the given id not found");
  }
}