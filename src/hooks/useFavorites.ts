import { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';

/**
 * Custom hook to access the favorites context
 * Provides access to the favorites list and methods to toggle/check favorites
 * @returns The favorites context containing favorites array, toggleFavorite, and isFavorite functions
 * @throws Error if used outside of FavoritesProvider
 */
export function useFavorites() {
  const context = useContext(FavoritesContext);
  // Ensure the hook is used within the FavoritesProvider
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
