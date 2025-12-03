import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPokemon } from '../utils/api';
import { useFavorites } from '../hooks/useFavorites';
import { useScrollPosition } from '../hooks/useScrollPosition';
import { PokemonCard } from '../components/PokemonCard';
import { ScrollToTopButton } from '../components/ScrollToTopButton';

/**
 * Simplified Pokemon data for displaying in the favorites list
 */
type Favorite = {
  /** Pokemon's unique ID */
  id: number;
  /** Pokemon's name */
  name: string;
  /** Array of type names for this Pokemon */
  types: string[];
};

/**
 * Favorites page component that displays all Pokemon marked as favorites
 * Fetches full Pokemon data for each favorite ID and displays them as cards
 */
export default function FavoritesPage() {
  const {
    favorites,
    favoritesData,
    setFavoritesData,
    scrollPosition: savedScrollPosition,
    setScrollPosition: setSavedScrollPosition,
  } = useFavorites();
  const [loading, setLoading] = useState(false);
  const currentScrollPosition = useScrollPosition();

  // Restore scroll position on mount
  useEffect(() => {
    if (savedScrollPosition > 0) {
      window.scrollTo(0, savedScrollPosition);
    }
  }, []);

  // Save scroll position on unmount
  useEffect(() => {
    return () => {
      setSavedScrollPosition(currentScrollPosition);
    };
  }, [currentScrollPosition, setSavedScrollPosition]);

  // Fetch full Pokemon data for new favorites
  useEffect(() => {
    const loadedIds = new Set(favoritesData.map((f) => f.id));
    const missingIds = favorites.filter((id) => !loadedIds.has(id));

    if (missingIds.length === 0) {
      return;
    }

    setLoading(true);
    Promise.all(
      missingIds.map((id) =>
        fetchPokemon(id).then((data) => ({
          id: data.id,
          name: data.name,
          types: data.types.map((t: any) => t.type.name),
        }))
      )
    )
      .then((newFavorites) => {
        setFavoritesData((prev) => [...prev, ...newFavorites]);
      })
      .finally(() => setLoading(false));
  }, [favorites, favoritesData, setFavoritesData]);

  // Combine favorites order with loaded data
  const displayedFavorites = favorites
    .map((id) => favoritesData.find((f) => f.id === id))
    .filter((f): f is Favorite => f !== undefined);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-slideIn">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-yellow-400 text-4xl">★</span>
            PokéFaves
          </h1>
          <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
            {favorites.length} saved
          </span>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        )}

        {!loading && displayedFavorites.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedFavorites.map((p) => (
              <PokemonCard key={p.id} id={p.id} name={p.name} types={p.types} />
            ))}
          </div>
        )}

        {!loading && !displayedFavorites.length && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <div className="text-6xl mb-4">🥺</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-500 mb-6">
              Start exploring and add some Pokémon to your collection!
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Explore Pokémon
            </Link>
          </div>
        )}
      </div>
      <ScrollToTopButton />
    </>
  );
}
