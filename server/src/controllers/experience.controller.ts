// server/src/controllers/experience.controller.ts

import { Request, Response } from 'express';
import Experience from '../models/Experience.model';
import Slot from '../models/Slot.model';
import Booking from '../models/Booking.model'; // <-- IMPORT BOOKING MODEL

/**
 * @route GET /api/experiences
 * @desc Get all experiences
 */
export const getAllExperiences = async (req: Request, res: Response) => {
  try {
    const experiences = await Experience.find({});
    res.status(200).json(experiences);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching experiences', error });
  }
};

/**
 * @route GET /api/experiences/:id
 * @desc Get a single experience and its available slots
 */
export const getExperienceById = async (req: Request, res: Response) => {
  try {
    const experienceId = req.params.id;

    // 1. Find the experience
    const experience = await Experience.findById(experienceId);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    // 2. Find all slots for this experience
    const slots = await Slot.find({
      experienceId: experienceId,
      startTime: { $gte: new Date() }, // Only find slots from now onwards
    }).lean(); // Use .lean() for faster, plain JS objects

    // 3. NEW: Calculate remaining capacity for each slot
    const slotsWithAvailability = await Promise.all(
      slots.map(async (slot:any) => {
        // Find all bookings for this specific slot
        const existingBookings = await Booking.find({ slotId: slot._id });
        
        // Sum the 'quantity' from all bookings for this slot
        const bookedCapacity = existingBookings.reduce(
          (total:number, b:any) => total + b.quantity,
          0
        );

        // Calculate spots left
        const remainingCapacity = slot.capacity - bookedCapacity;

        return {
          ...slot,
          remainingCapacity: remainingCapacity, // Add this new property
        };
      })
    );

    // 4. Send back the experience and the enhanced slots
    res.status(200).json({
      experience,
      availableSlots: slotsWithAvailability,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching experience details', error });
  }
};