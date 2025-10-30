// server/src/seed.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db';
import Experience from './models/Experience.model';
import Slot from './models/Slot.model';
import PromoCode from './models/PromoCode.model';

// Load .env variables
dotenv.config({ path: '../.env' }); // Make sure it finds the .env in the server root

// --- Helper Functions for Randomization ---

/**
 * Gets a random integer between min and max (inclusive)
 */
const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Gets a random date in the next 1-7 days, at a random hour (7am-3pm)
 */
const getRandomSlotTime = () => {
  const today = new Date();
  const randomDayOffset = getRandomInt(1, 7); // 1-7 days from now
  const randomHour = getRandomInt(7, 15); // 7 AM to 3 PM

  const slotDate = new Date(today);
  slotDate.setDate(today.getDate() + randomDayOffset);
  slotDate.setHours(randomHour, 0, 0, 0); // Set to the random hour, sharp

  return slotDate;
};

/**
 * Get a random capacity, with a higher chance of "sold out" or "low"
 */
const getRandomCapacity = () => {
  const capacities = [0, 3, 5, 10, 10, 15]; // Weighted array
  return capacities[getRandomInt(0, capacities.length - 1)];
};

// --- Sample Data (Unchanged) ---
const sampleExperiences = [
  // ... (Your 16 experiences are here) ...
  // (Paste your 16 experience objects here)
  {
    name: 'Kayaking in the Mangroves',
    description:
      'Curated small-group experience. Certified guide. Safety first with gear included. Helmet and Life jackets along with an expert will accompany in kayaking.',
    price: 999,
    imageUrl: 'https://images.unsplash.com/photo-1714577419068-45189e7bda58?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1863',
    location: 'Udupi, Karnataka',
    locationTag: 'Udupi',
  },
  {
    name: 'Nandi Hills Sunrise',
    description:
      'Witness the breathtaking sunrise from Nandi Hills. A perfect getaway for nature lovers and photographers.',
    price: 899,
    imageUrl: 'https://images.unsplash.com/photo-1747321752407-2e247fb3b705?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1974',
    location: 'Bangalore, Karnataka',
    locationTag: 'Bangalore',
  },
  {
    name: 'Boat Cruise',
    description:
      'A relaxing boat cruise through the scenic Sunderban delta. Keep an eye out for wildlife.',
    price: 1499,
    imageUrl: 'https://images.unsplash.com/photo-1701186598733-3403fac40355?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2340',
    location: 'Sunderban, West Bengal',
    locationTag: 'Sunderban',
  },
  {
    name: 'Bungee Jumping',
    description:
      'Experience the ultimate thrill with a bungee jump from one of the highest points in Manali.',
    price: 2500,
    imageUrl: 'https://images.unsplash.com/photo-1559677624-3c956f10d431?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1925',
    location: 'Manali, Himachal Pradesh',
    locationTag: 'Manali',
  },
  {
    name: 'Scuba Diving',
    description:
      'Discover the vibrant marine life and coral reefs of the Andaman islands.',
    price: 4500,
    imageUrl: 'https://images.unsplash.com/photo-1682687982360-3fbab65f9d50?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2340',
    location: 'Andaman',
    locationTag: 'Andaman',
  },
  {
    name: 'Jungle Trek',
    description:
      'A guided trek deep into the dense rainforests of the Western Ghats.',
    price: 1100,
    imageUrl: 'https://images.unsplash.com/photo-1554039362-6daf559ddb63?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2340',
    location: 'Western Ghats',
    locationTag: 'Ghats',
  },
  {
    name: 'Rock Climbing',
    description:
      'Learn the basics of rock climbing and bouldering on natural rock faces.',
    price: 1300,
    imageUrl: 'https://images.unsplash.com/photo-1508287459906-37445322fdf6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=3270',
    location: 'Hampi, Karnataka',
    locationTag: 'Hampi',
  },
  {
    name: 'Ziplining',
    description:
      'Fly across valleys and forests on a network of exciting ziplines.',
    price: 1900,
    imageUrl: 'https://images.unsplash.com/photo-1679117730976-cdb5f6b05b88?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2340',
    location: 'Goa',
    locationTag: 'Goa',
  },
];

const samplePromoCodes = [
  {
    code: 'SAVE10',
    discountType: 'percent',
    discountValue: 10,
    isActive: true,
  },
  {
    code: 'FLAT100',
    discountType: 'fixed',
    discountValue: 100,
    isActive: true,
  },
];

// --- Seeder Function ---

const importData = async () => {
  try {
    // 1. Connect to the database
    await connectDB();
    console.log('Database connected...');

    // 2. Clear existing data
    await Experience.deleteMany({});
    await Slot.deleteMany({});
    await PromoCode.deleteMany({});
    console.log('Old data cleared...');

    // 3. Insert experiences
    const createdExperiences = await Experience.insertMany(sampleExperiences);
    console.log('Experiences imported...');

    // 4. --- NEW RANDOM SLOT GENERATION ---
    const allSlots = [];
    for (const exp of createdExperiences) {
      // Each experience gets 3-6 random slots
      const numSlotsToCreate = getRandomInt(3, 6);

      for (let i = 0; i < numSlotsToCreate; i++) {
        allSlots.push({
          experienceId: exp._id,
          startTime: getRandomSlotTime(),
          capacity: getRandomCapacity(),
        });
      }
    }

    await Slot.insertMany(allSlots);
    console.log(`Slots imported (${allSlots.length} random slots created)...`);
    // --- END NEW SLOT GENERATION ---

    // 5. Insert promo codes
    await PromoCode.insertMany(samplePromoCodes);
    console.log('Promo codes imported...');

    console.log('✅ Data seeding complete!');
    process.exit();
  } catch (error) {
    console.error('Error with data seeding:', error);
    process.exit(1);
  }
};

// Run the function
importData();