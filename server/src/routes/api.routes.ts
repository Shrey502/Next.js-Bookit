// server/src/routes/api.routes.ts

import { Router } from 'express';
import {
  getAllExperiences,
  getExperienceById,
} from '../controllers/experience.controller';
import { createBooking } from '../controllers/booking.controller'; // <-- IMPORT
import { validatePromoCode } from '../controllers/promo.controller'; // <-- IMPORT

const router = Router();

// --- Experience Routes ---
router.get('/experiences', getAllExperiences);
router.get('/experiences/:id', getExperienceById);

// --- Promo Code Routes ---
router.post('/promo/validate', validatePromoCode); // <-- ADD THIS

// --- Booking Routes ---
router.post('/bookings', createBooking); // <-- ADD THIS

export default router;