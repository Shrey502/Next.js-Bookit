// client/src/pages/checkout.tsx

import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useBooking } from '@/context/BookingContext';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Helper to format date/time
const formatSlotTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const CheckoutPage: NextPage = () => {
  const { booking, setBooking } = useBooking(); // Get setBooking from context
  const router = useRouter();

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [promoCode, setPromoCode] = useState('');

  // API state
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- NEW: Promo code state ---
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccess, setPromoSuccess] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Redirect if there's no booking in context
  useEffect(() => {
    if (!booking) {
      router.push('/');
    }
  }, [booking, router]);

  // If there's no booking, show a loading/redirecting message
  if (!booking) {
    return (
      <div className="container text-center mt-5">
        <p>Loading booking details...</p>
      </div>
    );
  }

  // --- NEW: Recalculate prices based on discount ---
  // Base subtotal (price * quantity)
  const subtotal = booking.experience!.price * booking.quantity;
  // Tax is on the *discounted* price
  const taxes = Math.floor((subtotal - discountAmount) * 0.05);
  // Final total
  const total = subtotal - discountAmount + taxes;

  // --- NEW: Promo Code Handler ---
  const handleApplyPromo = async () => {
    if (!promoCode) {
      setPromoError('Please enter a promo code.');
      return;
    }

    setIsLoading(true);
    setPromoError(null);
    setPromoSuccess(null);

    try {
      const res = await axios.post(
        '${process.env.NEXT_PUBLIC_API_BASE_URL}/api/promo/validate',
        { code: promoCode }
      );

      const { promo } = res.data;
      let newDiscount = 0;

      if (promo.discountType === 'percent') {
        newDiscount = (subtotal * promo.discountValue) / 100;
      } else if (promo.discountType === 'fixed') {
        newDiscount = promo.discountValue;
      }

      // Don't let discount be more than subtotal
      newDiscount = Math.min(newDiscount, subtotal);

      setDiscountAmount(newDiscount);
      setPromoSuccess(`Code "${promo.code}" applied! You saved ₹${newDiscount}.`);

      // Update the booking in context with the new total
      setBooking({
        ...booking,
        totalPrice: subtotal - newDiscount + taxes, // Set the new final total
      });
    } catch (err: any) {
      setDiscountAmount(0); // Reset discount
      if (axios.isAxiosError(err) && err.response) {
        setPromoError(err.response.data.message || 'Invalid code.');
      } else {
        setPromoError('Error validating code.');
      }
    }
    setIsLoading(false);
  };

  // --- UPDATED: Handle Submit ---
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking || !booking.slot) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        '${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bookings',
        {
          experienceId: booking.experience?._id,
          slotId: booking.slot._id,
          userName: name,
          userEmail: email,
          quantity: booking.quantity,
          pricePaid: total, // Use the new 'total' calculated with discount
          promoCode: promoSuccess ? promoCode : undefined, // Only send if valid
        }
      );

      const bookingRef = response.data.booking.bookingRef;
      router.push(`/result?ref=${bookingRef}&status=success`);
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Booking failed.');
      } else {
        setError('An unknown error occurred.');
      }
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Checkout - BookIt</title>
      </Head>

      <div className="container mt-4">
        <Link
          href={`/experience/${booking.experience?._id}`}
          className="text-dark fw-bold text-decoration-none mb-3 d-inline-block"
        >
          &larr; Checkout
        </Link>

        <div className="row">
          {/* --- Column 1: Form --- */}
          <div className="col-lg-7">
            <div className="card border-0 bookit-card p-4">
              <h3 className="fw-bold mb-4">Your Information</h3>

              <form id="checkoutForm" onSubmit={handleSubmitBooking}>
                <div className="row">
                  {/* ... (Full name and Email inputs are unchanged) ... */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="fullName" className="form-label">
                      Full name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="fullName"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* --- NEW: Promo Code Section with Messages --- */}
                <div className="mb-3">
                  <label htmlFor="promoCode" className="form-label">
                    Promo code (e.g., SAVE10, FLAT100)
                  </label>
                  <div className="d-flex">
                    <input
                      type="text"
                      className="form-control"
                      id="promoCode"
                      value={promoCode}
                      onChange={(e) =>
                        setPromoCode(e.target.value.toUpperCase())
                      }
                      disabled={!!promoSuccess} // Disable if code is already applied
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary ms-2"
                      onClick={handleApplyPromo}
                      disabled={isLoading || !!promoSuccess}
                    >
                      {isLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                  {/* Show success/error messages */}
                  {promoSuccess && (
                    <div className="form-text text-success">
                      {promoSuccess}
                    </div>
                  )}
                  {promoError && (
                    <div className="form-text text-danger">{promoError}</div>
                  )}
                </div>

                <div className="form-check mb-4">
                  {/* ... (Checkbox is unchanged) ... */}
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="terms"
                    required
                  />
                  <label className="form-check-label" htmlFor="terms">
                    I agree to the terms and safety policy
                  </label>
                </div>
              </form>
            </div>
          </div>

          {/* --- Column 2: Summary (UPDATED) --- */}
          <div className="col-lg-5">
            <div className="card border-0 shadow rounded-4 p-4">
              <h4 className="fw-bold mb-3">Booking Summary</h4>
              {/* ... (Experience, Date, Qty are unchanged) ... */}
              <div className="d-flex justify-content-between mb-2">
                <span>Experience</span>
                <span className="fw-bold">{booking.experience?.name}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Date & Time</span>
                <span className="fw-bold">
                  {booking.slot ? formatSlotTime(booking.slot.startTime) : '...'}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Qty</span>
                <span className="fw-bold">{booking.quantity}</span>
              </div>

              <hr />

              {/* --- NEW: Price calculations use new variables --- */}
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span className="text-muted">₹{subtotal}</span>
              </div>
              
              {/* Show discount if applied */}
              {discountAmount > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span className="text-muted">Discount</span>
                  <span className="text-muted">- ₹{discountAmount}</span>
                </div>
              )}

              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Taxes (5%)</span>
                <span className="text-muted">₹{taxes}</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between h4 fw-bold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              {/* Final Submit Button */}
              <button
                type="submit"
                form="checkoutForm"
                className="btn btn-warning btn-lg fw-bold w-100 mt-3"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Pay and Confirm'}
              </button>

              {error && (
                <div className="alert alert-danger mt-3">{error}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;