// client/src/pages/_app.tsx

import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/globals.css';

import type { AppProps } from 'next/app';
import Layout from '@/components/common/Layout';
import { BookingProvider } from '@/context/BookingContext';
import { SearchProvider } from '@/context/SearchContext'; // <-- 1. IMPORT

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SearchProvider> {/* <-- 2. WRAP HERE */}
      <BookingProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </BookingProvider>
    </SearchProvider> /* <-- 3. AND HERE */
  );
}