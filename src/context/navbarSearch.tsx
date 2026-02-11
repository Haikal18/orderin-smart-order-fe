'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type NavbarSearchContextType = {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
};

const NavbarSearchContext = createContext<NavbarSearchContextType | undefined>(undefined);

export function NavbarSearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <NavbarSearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </NavbarSearchContext.Provider>
  );
}

export function useNavbarSearch() {
  return useContext(NavbarSearchContext);
}
