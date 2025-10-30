// server/src/models/PromoCode.model.ts

import { Schema, model, Document } from 'mongoose';

export interface IPromoCode extends Document {
  code: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  isActive: boolean;
}

const PromoCodeSchema = new Schema<IPromoCode>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true, // Store codes as uppercase (e.g., "SAVE10")
    },
    discountType: {
      type: String,
      enum: ['percent', 'fixed'],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const PromoCode = model<IPromoCode>('PromoCode', PromoCodeSchema);

export default PromoCode;