import Booking from "../models/Booking.js";
import { create_error } from "../utils/error.js";

// Create a new booking
export const createBooking = async (req, res, next) => {
  try {
    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    next(err);
  }
};

// Get a specific booking
export const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return next(create_error(404, "Booking not found"));
    res.status(200).json(booking);
  } catch (err) {
    next(err);
  }
};

// Get all bookings (with optional filtering)
export const getAllBookings = async (req, res, next) => {
  try {
    const { userId, hotelId, status, limit, countTotal, ...others } = req.query;
    const query = { ...others };

    if (userId) query.userId = userId;
    if (hotelId) query.hotelId = hotelId;
    if (status) query.status = status;

    // Count total if requested
    let total = 0;
    if (countTotal === 'true') {
      total = await Booking.countDocuments(query);
    }

    const bookings = await Booking.find(query)
      .limit(parseInt(limit) || 0)
      .populate('userId', 'username email')
      .populate('hotelId', 'name');

    if (countTotal === 'true') {
      return res.status(200).json({ bookings, total });
    }

    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
};

// Update a booking
export const updateBooking = async (req, res, next) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedBooking);
  } catch (err) {
    next(err);
  }
};

// Delete a booking
export const deleteBooking = async (req, res, next) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Booking has been deleted" });
  } catch (err) {
    next(err);
  }
};

// Get booking statistics - useful for admin dashboard
export const getBookingStats = async (req, res, next) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: "confirmed" });
    const pendingBookings = await Booking.countDocuments({ status: "pending" });
    const cancelledBookings = await Booking.countDocuments({ status: "cancelled" });
    
    // Revenue stats - last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentBookings = await Booking.find({
      createdAt: { $gte: thirtyDaysAgo },
      status: { $in: ['confirmed', 'completed'] }
    });
    
    const totalRevenue = recentBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
    
    res.status(200).json({
      total: totalBookings,
      confirmed: confirmedBookings,
      pending: pendingBookings,
      cancelled: cancelledBookings,
      recentRevenue: totalRevenue
    });
  } catch (err) {
    next(err);
  }
}; 