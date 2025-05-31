import express from "express";
import { createUser, updateUser, deleteUser, getUser, getAllUsers } from "../controllers/users.js"; // Import the controllers
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifytoken.js";
const router = express.Router();

router.get("/checkauthentication" , verifyToken,(req,res,next)=>{
    res.send("hello user , you are logged in !");
})

router.get("/checkuser/:id" , verifyUser ,(req,res,next)=>{
    res.send("hello user , you are logged in and you can delete your account !");
})

router.get("/checkAdmin/:id" , verifyAdmin ,(req,res,next)=>{
    res.send("hello Admin , you are logged in and you can delete any account !");
})

// Create user (admin only)
router.post("/", verifyAdmin, createUser);

// Update user
router.put("/:id",verifyUser, updateUser);

// Delete user
router.delete("/:id",verifyUser, deleteUser);

// Get user
router.get("/:id",verifyUser, getUser);

// Get all users
router.get("/", verifyAdmin, getAllUsers);

export default router;
