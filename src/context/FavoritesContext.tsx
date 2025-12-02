import React, { createContext, useState, useEffect, ReactNode } from 'react';

/**
 * Type definition for the Favorites context
 * Provides access to the favorites list and methods to manage favorites
 */
type FavoritesContextType = {
  /** Array of Pokemon IDs that are marked as favorites */
  favorites: number[];
  /** Function to add or remove a Pokemon from favorites */
  toggleFavorite: (id: number) => void;
  /** Function to check if a Pokemon is in favorites */
  isFavorite: (id: number) => boolean;
};

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_KEY = 'favorites';

/**
 * Provider component that manages Pokemon favorites state
 * Persists favorites to localStorage and provides context to child components
 * @param children - React child components that will have access to the favorites context
 */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (raw) {
      try {
        setFavorites(JSON.parse(raw));
      } catch (e) {
        console.error('Failed to parse favorites from localStorage', e);
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  /**
   * Toggles a Pokemon's favorite status
   * If the Pokemon is already a favorite, it will be removed; otherwise, it will be added
   * @param id - The Pokemon's ID
   */
  function toggleFavorite(id: number) {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  }

  /**
   * Checks if a Pokemon is currently marked as a favorite
   * @param id - The Pokemon's ID
   * @returns True if the Pokemon is a favorite, false otherwise
   */
  function isFavorite(id: number) {
    return favorites.includes(id);
  }

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}
