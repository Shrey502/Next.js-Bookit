// client/src/context/BookingContext.tsx

import { createContext, useContext, useState, ReactNode } from 'react';
import { IExperience, ISlot } from '@/types';

// 1. Define the shape of our booking
export interface BookingDetails {
  experience: IExperience | null;
  slot: ISlot | null;
  quantity: number;
  totalPrice: number;
}

// 2. Define the shape of our context
interface IBookingContext {
  booking: BookingDetails | null;
  setBooking: (details: BookingDetails) => void;
}

// 3. Create the context with a default value
export const BookingContext = createContext<IBookingContext | undefined>(
  undefined
);

// 4. Create the Provider (the component that holds the state)
export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [booking, setBookingState] = useState<BookingDetails | null>(null);

  const setBooking = (details: BookingDetails) => {
    setBookingState(details);
  };

  return (
    <BookingContext.Provider value={{ booking, setBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

// 5. Create a custom hook to easily use the context
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};