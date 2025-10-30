// server/src/models/Slot.model.ts

import { Schema, model, Document, Types } from 'mongoose';

// Interface for the Slot document
export interface ISlot extends Document {
  experienceId: Types.ObjectId; // Foreign key to the Experience collection
  startTime: Date;
  capacity: number; // Maximum number of people
}

// Define the schema
const SlotSchema = new Schema<ISlot>(
  {
    experienceId: {
      type: Schema.Types.ObjectId,
      ref: 'Experience', // This links it to the Experience model
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      default: 10, // Default capacity of 10 unless specified
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the model
const Slot = model<ISlot>('Slot', SlotSchema);

export default Slot;