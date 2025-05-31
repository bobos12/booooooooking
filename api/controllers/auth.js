import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { create_error } from "../utils/error.js"; 
import jwt from "jsonwebtoken";

// Auth Service (separated business logic)
const authService = {
  createUser: async (userData) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(userData.password, salt);
    
    const newUser = new User({
      ...userData,
      password: hash,
    });
    
    return await newUser.save();
  },

  findUserByUsername: async (username) => {
    return await User.findOne({ username });
  },

  verifyPassword: async (password, hash) => {
    return await bcrypt.compare(password, hash);
  },

  generateToken: (user) => {
    return jwt.sign(
      { id: user._id, admin: user.admin }, 
      process.env.JWT_SECRET || "msa", // Fallback for development
      { expiresIn: "1h" }
    );
  }
};

export const register = async (req, res, next) => {
  try {
    await authService.createUser(req.body);
    res.status(201).send("User has been created successfully");
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await authService.findUserByUsername(req.body.username);
    if (!user) return next(create_error(404, "User not found"));

    const isPasswordValid = await authService.verifyPassword(req.body.password, user.password);
    if (!isPasswordValid) return next(create_error(401, "Wrong credentials"));

    const token = authService.generateToken(user);
    const { password, ...userDetails } = user._doc;
    
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000 // 1 day expiration
    }).status(200).json({
      details: userDetails, 
      isAdmin: user.admin
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("access_token", {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true
    }).status(200).json("User has been logged out successfully");
  } catch (err) {
    next(err);
  }
};

export const checkUsername = async (req, res, next) => {
  try {
    const user = await authService.findUserByUsername(req.query.username);
    res.status(200).json({ available: !user });
  } catch (err) {
    next(err);
  }
};