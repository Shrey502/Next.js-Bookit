// client/src/components/common/Navbar.tsx

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearch } from '@/context/SearchContext'; // <-- 1. IMPORT

export default function Navbar() {
  const { searchQuery, setSearchQuery } = useSearch(); // <-- 2. USE THE HOOK

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
      <div className="container py-2">
        {/* Logo */}
        <Link href="/" className="navbar-brand d-flex align-items-center">
          <Image
            src="/logo.png"
            alt="Highway Delite Logo"
            width={120}
            height={60}
            priority
          />
        </Link>

        {/* Search Bar */}
        {/* 3. Remove the <form> tag */}
        <div className="d-flex ms-auto" style={{ minWidth: '300px' }}>
          {/* 4. Connect the input */}
          <input
            className="form-control me-2 bg-light border-0"
            type="search"
            placeholder="Search experiences"
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-warning text-dark" type="submit">
            Search
          </button>
        </div>
      </div>
    </nav>
  );
}