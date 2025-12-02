import { useState } from 'react';
import { useFavorites } from '../hooks/useFavorites';

/**
 * Button component to toggle a Pokemon's favorite status
 * Displays a filled star (★) if favorited, empty star (☆) if not
 * @param props - Component props containing the Pokemon ID
 */
export function FavoriteButton({
  id,
  name,
  tooltipPosition = 'top',
}: {
  id: number;
  name: string;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [showTooltip, setShowTooltip] = useState(false);
  const isFav = isFavorite(id);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-800',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-800',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-800',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-800',
  };

  return (
    <div
      className="relative inline-block z-30"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(id, name);
        }}
        aria-label={isFav ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
        className="text-2xl hover:scale-110 transition-transform focus:outline-none cursor-pointer"
      >
        {isFav ? (
          <span className="text-yellow-400 drop-shadow-sm">★</span>
        ) : (
          <span className="text-gray-300 hover:text-yellow-400 transition-colors">☆</span>
        )}
      </button>

      <div
        className={`absolute ${positionClasses[tooltipPosition]} px-2 py-1 bg-gray-800 text-white text-xs rounded transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg ${showTooltip ? 'opacity-100' : 'opacity-0'}`}
      >
        {isFav ? 'Remove from favorites' : 'Add to favorites'}
        <div
          className={`absolute border-4 border-transparent ${arrowClasses[tooltipPosition]}`}
        ></div>
      </div>
    </div>
  );
}
