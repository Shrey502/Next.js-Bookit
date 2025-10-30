// client/src/components/home/ExperienceCard.tsx

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IExperience } from '@/types';

type Props = {
  experience: IExperience;
};

export default function ExperienceCard({ experience }: Props) {
  return (
    <div className="col-lg-3 col-md-6 mb-4">
      {/* The Link component wraps all card content */}
      <Link
        href={`/experience/${experience._id}`}
        className="card h-100 border-0 text-decoration-none text-dark d-flex flex-column bookit-card"
      >
        {/* 1. Image */}
        <Image
          src={experience.imageUrl}
          alt={experience.name}
          width={400}
          height={160} // <-- CHANGE TO 200
          className="card-img-top"
          style={{ objectFit: 'cover', borderRadius: '0.5rem 0.5rem 0rem 0rem' }}
        />

        {/* 2. Card Body (This was missing from your render) */}
        <div className="card-body flex-grow-1">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <h5 className="card-title mb-0">{experience.name}</h5>
            <span className="badge ">{experience.locationTag}</span>
          </div>
          <p className="card-text small text-muted">{experience.description}</p>
        </div>

        {/* 3. Card Footer */}
        <div className="card-footer border-0 pt-0 d-flex justify-content-between align-items-center background-color: rgb(240, 240, 240);">
          <span className="fw-bold fs-7">From ₹{experience.price}</span>
          <button className="btn btn-warning btn-sm">View Details</button>
        </div>
      </Link>
    </div>
  );
}