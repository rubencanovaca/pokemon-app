import React from 'react';
import { useFavorites } from '../hooks/useFavorites';

/**
 * Button component to toggle a Pokemon's favorite status
 * Displays a filled star (★) if favorited, empty star (☆) if not
 * @param props - Component props containing the Pokemon ID
 */
export function FavoriteButton({ id }: { id: number }) {
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <button
      onClick={(e) => {
        // Prevent the click from bubbling up to parent Link elements
        e.stopPropagation();
        toggleFavorite(id);
      }}
    >
      {isFavorite(id) ? '★' : '☆'}
    </button>
  );
}
