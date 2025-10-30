// client/src/pages/experience/[id].tsx

import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import axios from 'axios';
import { IExperience, ISlot } from '@/types';
import { ParsedUrlQuery } from 'querystring';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/router'; // <-- Import Router
import { useBooking } from '@/context/BookingContext'; // <-- Import Context

// --- Helper Functions (for this page) ---
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

// --- Page Props ---
type DetailsPageProps = {
  experience: IExperience;
  slots: ISlot[];
};

// --- Page Component ---
const ExperienceDetails: NextPage<DetailsPageProps> = ({
  experience,
  slots,
}) => {
  // --- HOOKS ---
  const router = useRouter();
  const { setBooking } = useBooking();

  // --- STATE MANAGEMENT ---
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<ISlot | null>(null);
  const [quantity, setQuantity] = useState(1);

  // --- DERIVED STATE (for filtering slots) ---

  // 1. Get a unique list of available dates from the slots
  const availableDates = useMemo(() => {
    const dates = new Set(slots.map((slot) => formatDate(slot.startTime)));
    return Array.from(dates);
  }, [slots]);

  // 2. Filter time slots based on the selected date
  const timeSlotsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return slots.filter((slot) => formatDate(slot.startTime) === selectedDate);
  }, [selectedDate, slots]);

  // 3. Set the first available date as selected by default
  if (!selectedDate && availableDates.length > 0) {
    setSelectedDate(availableDates[0]);
  }

  // --- HANDLERS ---
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null); // Reset selected slot when date changes
  };

  const handleSlotSelect = (slot: ISlot) => {
    setSelectedSlot(slot);
  };

  // --- CALCULATIONS ---
  const price = experience.price;
  const taxes = Math.floor(price * 0.05 * quantity); // 5% tax
  const subtotal = price * quantity;
  const total = subtotal + taxes;

  // The button is disabled until a date AND time are selected
  const isConfirmDisabled = !selectedDate || !selectedSlot;

  // 5. CONFIRM HANDLER (for navigation)
  const handleConfirm = () => {
    if (isConfirmDisabled || !selectedSlot) return;

    // Save the complete booking details to our global state
    setBooking({
      experience: experience,
      slot: selectedSlot,
      quantity: quantity,
      totalPrice: total,
    });

    // Navigate to the checkout page
    router.push('/checkout');
  };

  return (
    <>
      <Head>
        <title>{experience.name} - BookIt</title>
      </Head>

      <div className="container mt-4">
        {/* Back Button */}
        <Link
          href="/"
          className="text-dark fw-bold text-decoration-none mb-3 d-inline-block"
        >
          &larr; Details
        </Link>

        <div className="row">
          {/* --- Column 1: Image, Details, AND Pickers (Compact) --- */}
          <div className="col-lg-7 d-flex flex-column gap-3">
            
            {/* 1. Image (765x381, all corners rounded) */}
            <div className="card border-0 bookit-card">
              <Image
                src={experience.imageUrl}
                alt={experience.name}
                width={765}
                height={381}
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>

            {/* 2. Title & Desc */}
            <div>
              <h1 className="fw-bold">{experience.name}</h1>
              <p className="lead text-muted">{experience.description}</p>
            </div>

            {/* 3. Date Picker */}
            <div className="mb-3">
              <h5 className="fw-bold mb-3">Choose date</h5>
              <div className="date-picker">
                {availableDates.map((date) => (
                  <button
                    key={date}
                    className={`btn me-2 ${
                      selectedDate === date
                        ? 'btn-warning' // Active
                        : 'btn-outline-secondary' // Inactive
                    }`}
                    onClick={() => handleDateSelect(date)}
                  >
                    {date}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Time Picker */}
            <div className="mb-4">
              <h5 className="fw-bold mb-3">Choose time</h5>
              <div className="time-picker">
                {timeSlotsForSelectedDate.map((slot) => {
                  const isSoldOut = slot.remainingCapacity <= 0;
                  const isSelected = selectedSlot?._id === slot._id;

                  return (
                    <button
                      key={slot._id}
                      className={`btn me-2 mb-2 ${
                        isSelected
                          ? 'btn-warning' // Selected
                          : 'btn-outline-secondary' // Available
                      }`}
                      onClick={() => handleSlotSelect(slot)}
                      disabled={isSoldOut}
                    >
                      {formatTime(slot.startTime)}
                      {/* Show "X left" text */}
                      {!isSoldOut && slot.remainingCapacity <= 5 && (
                        <span className="slots-left-text">
                          {' '}
                          {slot.remainingCapacity} left
                        </span>
                      )}
                      {isSoldOut && <span> (Sold out)</span>}
                    </button>
                  );
                })}
              </div>
              <small className="text-muted">
                All times are in IST (GMT +5:30)
              </small>
            </div>

            {/* 5. About Box */}
            <div>
              <h3 className="fw-bold">About</h3>
              <p className="about-box">
                Scenic routes, trained guides, and safety briefing. Minimum age 10.
              </p>
            </div>
          </div>

          {/* --- Column 2: Booking Widget (Fixed Width, Compact) --- */}
          <div className="col-auto">
            <div className="card border-0 p-3 d-flex flex-column gap-3 bookit-card booking-widget">
              
              {/* --- Price Summary --- */}
              <div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="fs-5">Starts at</span>
                  <span className="fs-5 fw-bold">₹{price}</span>
                </div>
                {/* --- Quantity Selector --- */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fs-5">Quantity</span>
                  <div className="d-flex align-items-center">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity === 1}
                    >
                      -
                    </button>
                    <span className="mx-3 fs-5 fw-bold">{quantity}</span>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="fs-5 text-muted">Subtotal</span>
                  <span className="fs-5 text-muted">₹{subtotal}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="fs-5 text-muted">Taxes</span>
                  <span className="fs-5 text-muted">₹{taxes}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <span className="h4 mb-0 fw-bold">Total</span>
                  <span className="h4 mb-0 fw-bold">₹{total}</span>
                </div>
              </div>

              {/* --- The ONLY Confirm Button --- */}
              <button
                className="btn btn-warning btn-lg fw-bold w-100"
                disabled={isConfirmDisabled}
                onClick={handleConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExperienceDetails;

// --- Data Fetching (This code is unchanged) ---

// Define the interface for URL parameters
interface IParams extends ParsedUrlQuery {
  id: string;
}

// 1. getStaticPaths: Tell Next.js which pages to pre-render
export const getStaticPaths: GetStaticPaths = async () => {
  // Fetch all experience IDs from the backend
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/experiences`);
  const experiences: IExperience[] = res.data;

  // Create an array of 'paths' from the IDs
  const paths = experiences.map((exp) => ({
    params: { id: exp._id },
  }));

  return {
    paths,
    fallback: 'blocking', // If a page doesn't exist, try to build it
  };
};

// 2. getStaticProps: Fetch data for a SINGLE page
export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params as IParams;

  try {
    // Fetch the single experience and its slots
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/experiences/${id}`
    );

    // Our backend sends { experience: {...}, availableSlots: [...] }
    const { experience, availableSlots } = res.data;

    return {
      props: {
        experience,
        slots: availableSlots,
      },
      revalidate: 60, // Refresh the data every 60 seconds
    };
  } catch (error) {
    return {
      notFound: true, // If the ID is bad, show a 404 page
    };
  }
};