import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

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
