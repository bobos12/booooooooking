import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import bookingsRoute from "./routes/bookings.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { logger } from './middleware/logger.js';  

dotenv.config();  
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());
app.use(logger);

// API Routes
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);
app.use("/api/bookings", bookingsRoute);

// Error Handling Middleware
app.use((err, req, res, next) => {
    const errorstatus = err.status || 500;
    const errormessage = err.message || "something went wrong";
    return res.status(errorstatus).json({
        success: false,
        status: errorstatus,
        message: errormessage,
        stack: err.stack
    });
});

// MongoDB Connection
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to MongoDB.");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
    }
};

// MongoDB Connection Event Listeners
mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected!");
});

// Test Route
app.get("/", (req, res) => {
    res.send("Hiiii");
});

// Start Server
app.listen(8800, () => {
    connect();
    console.log("Connected to backend on port 8800!");
});