import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchPokemonList, fetchPokemon } from '../utils/api';
import { PokemonCard } from '../components/PokemonCard';
import { ScrollToTopButton } from '../components/ScrollToTopButton';
import { useMessage } from '../hooks/useMessage';
import useScrollPosition from '../hooks/useScrollPosition';
import { usePokemon } from '../context/PokemonContext';

/**
 * Simplified Pokemon data for displaying in the list view
 */
type PokemonPreview = {
  /** Pokemon's unique ID */
  id: number;
  /** Pokemon's name */
  name: string;
  /** Array of type names for this Pokemon */
  types: string[];
};

/**
 * Main Pokemon list page component with infinite scroll functionality
 * Loads Pokemon in batches of 20 as the user scrolls down
 */
export default function PokemonList() {
  const {
    pokemonList,
    setPokemonList,
    page,
    setPage,
    hasMore,
    setHasMore,
    scrollPosition: savedScrollPosition,
    setScrollPosition: setSavedScrollPosition,
  } = usePokemon();
  const [loading, setLoading] = useState(false);
  const loader = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const { showMessage } = useMessage();
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

  /**
   * Loads the next page of Pokemon from the API
   * Fetches 20 Pokemon at a time and appends them to the existing list
   */
  const loadMore = useCallback(() => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);
    fetchPokemonList(page * 20, 20)
      .then(async (data) => {
        if (data.results.length === 0) {
          setHasMore(false);
          return;
        }
        const results = await Promise.all(
          data.results.map(async (entry: any) => {
            const detail = await fetchPokemon(entry.name);
            return {
              id: detail.id,
              name: detail.name,
              types: detail.types.map((t: any) => t.type.name),
            };
          })
        );
        setPokemonList((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const uniqueResults = results.filter((p) => !existingIds.has(p.id));
          return [...prev, ...uniqueResults];
        });
        setPage((prev) => prev + 1);
        if (data.results.length < 20) setHasMore(false);
      })
      .catch((error) => {
        console.error('Error loading Pokemon:', error);
        showMessage('Failed to load Pokémon list', 'error');
      })
      .finally(() => {
        setLoading(false);
        loadingRef.current = false;
      });
  }, [hasMore, page, setHasMore, setPage, setPokemonList, showMessage]);

  // Initial load
  useEffect(() => {
    if (page === 0 && pokemonList.length === 0) {
      loadMore();
    }
  }, [page, pokemonList.length, loadMore]);

  // Setup IntersectionObserver for infinite scroll
  // When the loader element becomes visible, load more Pokemon
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.5 }
    );
    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [loadMore]);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-slideIn">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-red-600 text-4xl">●</span>
            Pokédex
          </h1>
          <span className="bg-gray-100 text-gray-600 text-sm font-medium px-3 py-1 rounded-full border border-gray-200">
            {pokemonList.length} loaded
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pokemonList.map((p) => (
            <PokemonCard key={p.id} id={p.id} name={p.name} types={p.types} />
          ))}
        </div>

        <div
          ref={loader}
          data-testid="infinite-scroll-loader"
          className="h-20 flex justify-center items-center mt-8"
        >
          {loading && (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
              <span className="text-gray-500 text-sm font-medium">Catching more Pokémon...</span>
            </div>
          )}
          {!hasMore && (
            <div className="text-gray-400 font-medium py-4">No more Pokémon to load.</div>
          )}
        </div>
      </div>
      <ScrollToTopButton />
    </>
  );
}
