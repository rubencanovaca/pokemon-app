import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPokemon } from '../utils/api';
import { useFavorites } from '../hooks/useFavorites';
import { PokemonCard } from '../components/PokemonCard';

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
  const { favorites } = useFavorites();
  const [favoritePokemon, setFavoritePokemon] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch full Pokemon data for all favorite IDs whenever the favorites list changes
  useEffect(() => {
    setLoading(true);
    Promise.all(
      favorites.map((id) =>
        fetchPokemon(id).then((data) => ({
          id: data.id,
          name: data.name,
          types: data.types.map((t: any) => t.type.name),
        }))
      )
    )
      .then((all) => setFavoritePokemon(all))
      .finally(() => setLoading(false));
  }, [favorites]);

  return (
    <main className="p-8">
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
        &lt; Back to List
      </Link>
      <h1 className="text-3xl font-bold mb-6">Favorite Pokémon</h1>
      {loading && <div className="text-center">Loading...</div>}
      <div className="flex flex-wrap gap-4 justify-center">
        {favoritePokemon.map((p) => (
          <PokemonCard key={p.id} id={p.id} name={p.name} types={p.types} />
        ))}
        {!loading && !favoritePokemon.length && <p className="text-gray-600">No favorites yet.</p>}
      </div>
    </main>
  );
}
