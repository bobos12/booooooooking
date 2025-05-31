import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

export const createHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body);

  try {
    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (err) {
    next(err);
  }
};

export const updateHotel = async (req, res, next) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    next(err);
  }
};

export const deleteHotel = async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json("Hotel deleted");
  } catch (err) {
    next(err);
  }
};

export const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (err) {
    next(err);
  }
};

export const getAllHotels = async (req, res, next) => {
  try {
    console.log("getAllHotels called with query:", req.query);
    
    // Extract and remove special parameters
    const { min, max, limit, featured, city, countTotal, timestamp, refresh, ...others } = req.query;
    
    // If countTotal is true, return total count
    if (countTotal === 'true') {
      console.log("Getting hotel count");
      const totalCount = await Hotel.countDocuments();
      return res.status(200).json({
        total: totalCount,
        limit: parseInt(limit) || 0
      });
    }
    
    // Normal query processing - ignore timestamp and refresh params
    const query = {};
    
    // Only add filtered params to query
    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    if (city) {
      query.city = new RegExp(city, 'i'); // Case-insensitive search
    }

    if (min || max) {
      query.cheapestprice = {};
      if (min) query.cheapestprice.$gte = parseInt(min);
      if (max) query.cheapestprice.$lte = parseInt(max);
    }

    console.log("Final MongoDB query:", query);
    const hotels = await Hotel.find(query).limit(parseInt(limit) || 0);
    console.log(`Found ${hotels.length} hotels`);
    
    res.status(200).json(hotels);
  } catch (err) {
    console.error("Error in getAllHotels:", err);
    next(err);
  }
};

export const countByCity = async (req, res) => {
  try {
    // Step 1: Clean and validate input
    const cities = req.query.cities
      ?.split(',')
      .map(city => city.trim().toLowerCase().replace(/['"]/g, ''))
      .filter(city => city.length > 0);

    if (!cities || cities.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Valid cities parameter required",
        example: "/api/hotels/count-by-city?cities=berlin,madrid,london"
      });
    }

    // Step 2: Case-insensitive exact match query
    const counts = await Promise.all(
      cities.map(city => 
        Hotel.countDocuments({ city: { $regex: new RegExp(`^${city}$`, 'i') } })
      )
    );

    res.status(200).json({
      success: true,
      data: counts,
      cities: cities.map((city, index) => ({ city, count: counts[index] }))
    });

  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const countByType = async (req, res, next) => {
  try {
    const types = ["hotel", "apartment", "resort", "villa", "cabin"];
    const counts = await Promise.all(
      types.map(type => Hotel.countDocuments({ type }))
    );

    res.status(200).json(
      types.map((type, i) => ({ type, count: counts[i] }))
    );
  } catch (err) {
    next(err);
  }
};

export const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    const list = await Promise.all(
      hotel.rooms.map( (room) => {
        return Room.findById(room);
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};