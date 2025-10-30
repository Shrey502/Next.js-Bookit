// client/src/components/common/Layout.tsx

import React from 'react';
import Navbar from './Navbar'; // Imports your Navbar

type LayoutProps = {
  children: React.ReactNode;
};

// This component wraps your page content
export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      <main>
        {/* All your page content will be rendered here */}
        {children}
      </main>
      {/* We can add a Footer component here later */}
    </>
  );
}