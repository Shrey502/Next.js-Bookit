// client/src/context/SearchContext.tsx

import { createContext, useContext, useState, ReactNode } from 'react';

// 1. Define the shape of our context
interface ISearchContext {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

// 2. Create the context
export const SearchContext = createContext<ISearchContext | undefined>(
  undefined
);

// 3. Create the Provider (the component that holds the state)
export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
};

// 4. Create a custom hook to easily use the context
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};