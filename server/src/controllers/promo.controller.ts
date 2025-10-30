// server/src/controllers/promo.controller.ts

import { Request, Response } from 'express';
import PromoCode from '../models/PromoCode.model';

/**
 * @route POST /api/promo/validate
 * @desc Validate a promo code
 */
export const validatePromoCode = async (req: Request, res: Response) => {
  // Get the code from the request body, convert to uppercase
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ message: 'Promo code is required.' });
  }

  const promoCodeString = code.toUpperCase();

  try {
    const promo = await PromoCode.findOne({
      code: promoCodeString,
      isActive: true,
    });

    if (!promo) {
      return res.status(404).json({ message: 'Invalid or expired promo code.' });
    }

    // Send back the valid promo code details
    res.status(200).json({
      message: 'Promo code applied successfully!',
      promo,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error validating promo code', error });
  }
};