// client/src/pages/result.tsx

import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

// This is a simple check icon component
const SuccessIcon = () => (
  <svg
    width="80"
    height="80"
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="40" cy="40" r="40" fill="#28a745" />
    <path
      d="M26 41.5L36.5 52L54 34"
      stroke="white"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ResultPage: NextPage = () => {
  const router = useRouter();
  const { ref, status } = router.query;

  // This is a "guard clause"
  // If the user lands here without a 'success' status,
  // redirect them to the home page.
  useEffect(() => {
    if (status !== 'success') {
      router.push('/');
    }
  }, [status, router]);

  // Show a loading state while redirecting
  if (status !== 'success') {
    return (
      <div className="container text-center mt-5">
        <p>Loading...</p>
      </div>
    );
  }

  // This is the success page from your design
  return (
    <>
      <Head>
        <title>Booking Confirmed - BookIt</title>
      </Head>

      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-6 offset-lg-3 text-center">
            <div className="card border-0 bookit-card p-4 p-md-5">
              <div className="mb-4">
                <SuccessIcon />
              </div>

              <h1 className="fw-bold">Booking Confirmed</h1>

              <p className="lead text-muted mb-4">
                Your booking has been successfully processed.
              </p>

              <div className="mb-4">
                <h5 className="text-muted mb-0">Ref ID:</h5>
                <h2 className="fw-bold">{ref}</h2>
              </div>

              <Link href="/" legacyBehavior>
                <a className="btn btn-warning w-100 fw-bold">Back to Home</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultPage;