import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchPokemonList, fetchPokemon } from '../utils/api';
import { PokemonCard } from '../components/PokemonCard';

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
  const [pokemon, setPokemon] = useState<PokemonPreview[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef<HTMLDivElement>(null);

  /**
   * Loads the next page of Pokemon from the API
   * Fetches 20 Pokemon at a time and appends them to the existing list
   */
  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
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
        setPokemon((prev) => [...prev, ...results]);
        setPage((old) => old + 1);
        if (data.results.length < 20) setHasMore(false);
      })
      .finally(() => setLoading(false));
  }, [loading, hasMore, page]);

  // On mount, load the first page if list is empty
  useEffect(() => {
    if (pokemon.length === 0) loadMore();
  }, []);

  // Setup IntersectionObserver for infinite scroll
  // When the loader element becomes visible, load more Pokemon
  useEffect(() => {
    if (loading) return;
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
  }, [loadMore, loading]);

  return (
    <>
      <div className="flex flex-wrap gap-4 justify-center p-8">
        {pokemon.map((p) => (
          <PokemonCard key={p.id} id={p.id} name={p.name} types={p.types} />
        ))}
      </div>
      <div ref={loader} data-testid="infinite-scroll-loader" className="h-8" />
      {loading && <div className="text-center my-8">Loading...</div>}
      {!hasMore && <div className="text-center my-8">No more Pokémon.</div>}
    </>
  );
}
