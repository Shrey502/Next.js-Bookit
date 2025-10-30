// server/src/models/Booking.model.ts

import { Schema, model, Document, Types } from 'mongoose';

export interface IBooking extends Document {
  experienceId: Types.ObjectId;
  slotId: Types.ObjectId;
  userName: string;
  userEmail: string;
  quantity: number;
  pricePaid: number;
  promoCode?: string;
  bookingRef: string; // The "Ref ID" from your design
}

const BookingSchema = new Schema<IBooking>(
  {
    experienceId: {
      type: Schema.Types.ObjectId,
      ref: 'Experience',
      required: true,
    },
    slotId: {
      type: Schema.Types.ObjectId,
      ref: 'Slot',
      required: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userEmail: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    pricePaid: {
      type: Number,
      required: true,
    },
    promoCode: {
      type: String,
    },
    bookingRef: {
      type: String,
      required: true,
      unique: true, // Every booking ref should be unique
    },
  },
  {
    timestamps: true,
  }
);

const Booking = model<IBooking>('Booking', BookingSchema);

export default Booking;