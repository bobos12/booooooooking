import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import {create_error} from "../utils/error.js";

export const createRoom = async (req,res,next) =>{

    const hotelId=req.params.hotelId;
    const newRoom = new Room(req.body);

    try{
        const saveRoom= await newRoom.save();
        try{
            await Hotel.findByIdAndUpdate(hotelId,{$addToSet : {rooms: saveRoom._id}});
        }catch(err){
            next(err);
        }
        res.status(200).json(saveRoom);
    }catch(err){
        next(err);
    }


};

export const updateRoom = async (req,res,next)=>
{
    
    try{
        const updateRoom= await Room.findByIdAndUpdate(req.params.id, {$set: req.body},{new:true})
            res.status(200).json(updateRoom);
        }catch(err){ 
            next(err);
        }
}

// حذف الغرفة
export const deleteRoom = async (req, res, next) => {
    const hotelId = req.params.hotelid;
    const roomId = req.params.id;
  
    try {
      // التحقق من وجود الفندق
      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
  
      // حذف الـ roomId من الـ rooms array في الـ Hotel
      const hotelUpdate = await Hotel.findByIdAndUpdate(hotelId, {
        $pull: { rooms: roomId }
      });
  
      // إذا لم يتم العثور على الغرفة في الـ Hotel
      if (!hotelUpdate) {
        return res.status(404).json({ message: "Room not found in the hotel" });
      }
  
      // حذف الغرفة من الـ Room collection
      const deletedRoom = await Room.findByIdAndDelete(roomId);
      if (!deletedRoom) {
        return res.status(404).json({ message: "Room not found" });
      }
  
      // إرجاع الـ Hotel المحدث بعد الحذف
      const updatedHotel = await Hotel.findById(hotelId);
      res.status(200).json(updatedHotel);
    } catch (err) {
      next(err);
    }
  };
  

export const getRoom = async (req,res,next)=>
    {
try{
        const  getRoom= await Hotel.find(req.params.id)
        res.status(200).json(getRoom);
    }catch(err){
            next(err);
        }
}

export const GetAllRooms = async (req,res,next)=> {
    try {
        const { limit = 10, page = 1, countTotal } = req.query;
        const limitValue = parseInt(limit);
        const skip = (parseInt(page) - 1) * limitValue;
        
        // If countTotal is true, just return the count
        if (countTotal === 'true') {
            const totalRooms = await Room.countDocuments();
            return res.status(200).json({
                total: totalRooms,
                page: parseInt(page),
                limit: limitValue
            });
        }
        
        // Otherwise, return paginated rooms
        const rooms = await Room.find()
            .skip(skip)
            .limit(limitValue);
            
        res.status(200).json(rooms);
    } catch (err) {
        next(err);
    }
}

export const updateRoomAvailability = async (req, res, next) => {
  try {
      // Validate input dates
      const dates = req.body.dates.map(date => {
          const d = new Date(date);
          if (isNaN(d.getTime())) throw new Error(`Invalid date: ${date}`);
          return d;
      });

      // Update room availability
      const result = await Room.findOneAndUpdate(
          { "RoomNumber._id": req.params.id },
          {
              $addToSet: {
                  "RoomNumber.$.unavailableDates": {
                      $each: dates
                  }
              }
          },
          { new: true } // Return the updated document
      );

      if (!result) {
          return res.status(404).json({ message: "Room not found" });
      }

      // Find the specific room number that was updated
      const updatedRoomNumber = result.RoomNumber.find(
          room => room._id.toString() === req.params.id
      );

      res.status(200).json({
          message: "Room availability updated",
          room: updatedRoomNumber
      });
  } catch (err) {
      next(err);
  }
};