import express from "express";
import { createRoom, deleteRoom, GetAllRooms, getRoom, updateRoom, updateRoomAvailability } from "../controllers/rooms.js";
import { verifyAdmin } from "../utils/verifytoken.js";

const router =express.Router();

//create
router.post("/:hotelId", verifyAdmin ,createRoom)

//update
router.put("/:id",verifyAdmin , updateRoom)
router.put("/availability/:id", updateRoomAvailability);



//delete
router.delete("/:id/:hotelid",verifyAdmin,deleteRoom)

//get
router.get("/:id",verifyAdmin,getRoom)


//getall
router.get("/",verifyAdmin,GetAllRooms)


export default router