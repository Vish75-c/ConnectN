import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fs from "fs";

const jwtMaxAge = 3 * 24 * 60 * 60;
const cookieMaxAge = jwtMaxAge * 1000;

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: jwtMaxAge,
  });
};

/* ---------------- SIGNUP ---------------- */
export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).send("Email and Password are required");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    res.cookie("jwt", createToken(email, user._id), {
      maxAge: cookieMaxAge,
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    });

    return res.status(201).json(user);
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).send("Internal Server Error");
  }
};

/* ---------------- LOGIN ---------------- */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).send("Email and Password are required");

    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send("Invalid password");

    res.cookie("jwt", createToken(email, user._id), {
      maxAge: cookieMaxAge,
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    });

    return res.status(200).json(user);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).send("Internal Server Error");
  }
};

/* ---------------- GET USER ---------------- */
export const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).send("User not found");
    return res.status(200).json(user);
  } catch {
    return res.status(401).send("Invalid user");
  }
};

/* ---------------- UPDATE PROFILE ---------------- */
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, color } = req.body;

    if (!firstName || !lastName)
      return res.status(400).send("First and last name required");

    const user = await User.findByIdAndUpdate(
      req.user,
      { firstName, lastName, color, profileSetup: true },
      { new: true, runValidators: true }
    );

    return res.status(200).json(user);
  } catch {
    return res.status(401).send("Invalid user");
  }
};

/* ---------------- ADD PROFILE IMAGE ---------------- */
export const addProfileImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("File is required");

    const date = Date.now();
    const filename = `uploads/profiles/${date}-${req.file.originalname}`;

    fs.renameSync(req.file.path, filename);

    const user = await User.findByIdAndUpdate(
      req.user,
      { image: filename },
      { new: true, runValidators: true }
    );

    return res.status(200).json({ image: user.image });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Image upload failed");
  }
};

/* ---------------- REMOVE PROFILE IMAGE ---------------- */
export const removeProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user || !user.image)
      return res.status(404).send("Image not found");

    fs.unlinkSync(user.image);

    user.image = null;
    await user.save();

    return res.status(200).send("Image removed");
  } catch {
    return res.status(500).send("Failed to remove image");
  }
};
