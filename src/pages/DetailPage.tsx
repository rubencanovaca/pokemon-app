import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPokemon } from '../utils/api';
import { FavoriteButton } from '../components/FavoriteButton';

/**
 * Represents a single stat entry for a Pokemon
 */
type PokemonStat = {
  /** The stat information (e.g., 'hp', 'attack') */
  stat: { name: string };
  /** The base value of this stat */
  base_stat: number;
};

/**
 * Represents a single type entry for a Pokemon
 */
type PokemonType = {
  /** The type information (e.g., 'fire', 'water') */
  type: { name: string };
};

/**
 * Represents a single move entry for a Pokemon
 */
type PokemonMove = {
  /** The move information (e.g., 'tackle', 'thunderbolt') */
  move: { name: string };
};

/**
 * Complete Pokemon data structure from the PokeAPI
 */
type Pokemon = {
  /** Pokemon's unique ID number */
  id: number;
  /** Pokemon's name */
  name: string;
  /** Sprite images for the Pokemon */
  sprites: any;
  /** Array of types this Pokemon has */
  types: PokemonType[];
  /** Array of moves this Pokemon can learn */
  moves: PokemonMove[];
  /** Array of base stats for this Pokemon */
  stats: PokemonStat[];
};

/**
 * Detail page component that displays comprehensive information about a specific Pokemon
 * Shows the Pokemon's image, types, stats, and moves
 * Fetches Pokemon data based on the ID from the URL parameter
 */
export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [error, setError] = useState('');

  // Fetch Pokemon data whenever the ID from the URL changes
  useEffect(() => {
    fetchPokemon(id!)
      .then(setPokemon)
      .catch(() => setError('Pokémon not found'));
  }, [id]);

  if (error) return <div>{error}</div>;
  if (!pokemon) return <div>Loading...</div>;

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
        &lt; Back
      </Link>
      <h2 className="text-3xl font-bold mb-4 capitalize">
        #{pokemon.id} {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
      </h2>
      <img
        src={pokemon.sprites.other['official-artwork'].front_default}
        alt={pokemon.name}
        width={256}
        height={256}
        className="mb-4"
      />
      <FavoriteButton id={pokemon.id} />

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Types</h3>
        <ul className="list-disc list-inside">
          {pokemon.types.map((t) => (
            <li key={t.type.name} className="capitalize">
              {t.type.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Stats</h3>
        <ul className="list-disc list-inside">
          {pokemon.stats
            .filter((s) =>
              ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'].includes(
                s.stat.name
              )
            )
            .map((s) => (
              <li key={s.stat.name} className="capitalize">
                {s.stat.name.replace('-', ' ')}: {s.base_stat}
              </li>
            ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Moves</h3>
        <ul className="list-disc list-inside">
          {pokemon.moves.slice(0, 20).map((m) => (
            <li key={m.move.name} className="capitalize">
              {m.move.name}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
