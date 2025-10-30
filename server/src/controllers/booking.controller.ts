// server/src/controllers/booking.controller.ts

import { Request, Response } from 'express';
import Booking from '../models/Booking.model';
import Slot from '../models/Slot.model';
import Experience from '../models/Experience.model';

// A simple function to generate a random Ref ID
const generateRefId = () => {
  return 'BK' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

/**
 * @route POST /api/bookings
 * @desc Create a new booking
 */
export const createBooking = async (req: Request, res: Response) => {
  const {
    experienceId,
    slotId,
    userName,
    userEmail,
    quantity,
    promoCode, // optional
  } = req.body;

  // --- 1. Basic Validation ---
  if (
    !experienceId ||
    !slotId ||
    !userName ||
    !userEmail ||
    !quantity
  ) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // --- 2. Find the Slot and Experience ---
    const slot = await Slot.findById(slotId);
    const experience = await Experience.findById(experienceId);

    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    // --- 3. Check for Double Booking (CRITICAL) ---
    // Count existing bookings for this specific slot
    const existingBookings = await Booking.find({ slotId: slotId });
    const bookedCapacity = existingBookings.reduce(
      (total, b) => total + b.quantity,
      0
    );

    const remainingCapacity = slot.capacity - bookedCapacity;

    if (quantity > remainingCapacity) {
      return res.status(400).json({
        message: `Sorry, only ${remainingCapacity} spots are left for this slot.`,
      });
    }

    // --- 4. Calculate Price (Simple version) ---
    // TODO: Add promo code logic here
    const pricePaid = experience.price * quantity;

    // --- 5. Create and Save the Booking ---
    const newBooking = new Booking({
      experienceId,
      slotId,
      userName,
      userEmail,
      quantity,
      pricePaid, // Use the calculated price
      promoCode,
      bookingRef: generateRefId(), // Generate a unique ref
    });

    await newBooking.save();

    res.status(201).json({
      message: 'Booking confirmed!',
      booking: newBooking,
    });
  } catch (error) {
    console.error('Booking creation failed:', error);
    res.status(500).json({ message: 'Error creating booking', error });
  }
};