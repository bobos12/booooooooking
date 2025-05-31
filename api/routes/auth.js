import express from "express";
import { register , checkUsername } from "../controllers/auth.js";
import { login } from "../controllers/auth.js";
import { logout } from "../controllers/auth.js";
const router =express.Router();



router.post("/register",register)
router.post("/login",login)
router.post("/logout",logout)
router.get("/check-username", checkUsername);


export default router