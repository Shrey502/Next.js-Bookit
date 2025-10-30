// server/src/models/Experience.model.ts

import { Schema, model, Document } from 'mongoose';

// Interface for the Experience document
export interface IExperience extends Document {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  location: string;
  locationTag: string; // e.g., "Udupi", "Coorg"
}

// Define the schema
const ExperienceSchema = new Schema<IExperience>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    locationTag: {
      type: String,
      required: true,
    },
  },
  {
    // Adds createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Create and export the model
// Mongoose will create a collection named "experiences" (plural, lowercase)
const Experience = model<IExperience>('Experience', ExperienceSchema);

export default Experience;