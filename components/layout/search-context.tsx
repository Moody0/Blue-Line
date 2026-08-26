"use client";

import React, { createContext, useContext, useState } from "react";
import { LiveSearchModal } from "./live-search-modal";

interface SearchModalContextValue {
  isOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
}

const SearchModalContext = createContext<SearchModalContextValue | undefined>(undefined);

export function SearchModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SearchModalContext.Provider
      value={{
        isOpen,
        openSearch: () => setIsOpen(true),
        closeSearch: () => setIsOpen(false),
        toggleSearch: () => setIsOpen((prev) => !prev),
      }}
    >
      {children}
      <LiveSearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </SearchModalContext.Provider>
  );
}

export function useSearchModal() {
  const context = useContext(SearchModalContext);
  if (!context) {
    throw new Error("useSearchModal must be used within a SearchModalProvider");
  }
  return context;
}
