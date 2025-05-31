import express from "express";
import { 
  countByCity,
  countByType,
  createHotel, 
  deleteHotel, 
  getAllHotels, 
  getHotel, 
  getHotelRooms, 
  updateHotel,
} from "../controllers/hotels.js";
import { verifyAdmin } from "../utils/verifytoken.js";

const router = express.Router();

// Special routes - must come first
router.get("/count-by-city", countByCity);
router.get("/count-by-type", countByType);
router.get("/room/:id", getHotelRooms);

// POST route
router.post("/", verifyAdmin, createHotel);

// ID-specific routes
router.put("/:id", verifyAdmin, updateHotel);
router.delete("/:id", verifyAdmin, deleteHotel);
router.get("/:id", getHotel);

// Generic GET route - must come last to avoid catching other routes
router.get("/", getAllHotels);

export default router;