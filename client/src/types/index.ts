// client/src/types/index.ts

// This type matches the IExperience model from our backend
export interface IExperience {
    _id: string; // MongoDB adds this
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    location: string;
    locationTag: string;
    createdAt: string; // Mongoose timestamps add this
    updatedAt: string;
  }

  export interface ISlot {
    _id: string;
    experienceId: string;
    startTime: string; // We'll get this as an ISO string
    capacity: number;
    remainingCapacity: number; // New field for remaining capacity
    createdAt: string;
    updatedAt: string;
  }