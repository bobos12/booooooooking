import express from "express";
import { 
  createBooking, 
  deleteBooking, 
  getAllBookings, 
  getBooking, 
  updateBooking,
  getBookingStats 
} from "../controllers/bookings.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifytoken.js";

const router = express.Router();

// Create a booking - any authenticated user can create a booking
router.post("/", verifyToken, createBooking);

// Get booking statistics - admin only
router.get("/stats/count", verifyAdmin, getBookingStats);

// Get all bookings - admins get all, users get only their bookings
router.get("/", verifyToken, getAllBookings);

// Get a specific booking - only admin or the booking owner can access
router.get("/:id", verifyUser, getBooking);

// Update a booking - only admin or the booking owner can update
router.put("/:id", verifyUser, updateBooking);

// Delete a booking - only admin or the booking owner can delete
router.delete("/:id", verifyUser, deleteBooking);

export default router; 