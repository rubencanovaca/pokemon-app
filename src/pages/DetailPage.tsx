import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPokemon } from '../utils/api';
import { useMessage } from '../hooks/useMessage';
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
  const { showMessage } = useMessage();

  const typeColors: Record<string, string> = {
    normal: 'bg-gray-400',
    fire: 'bg-orange-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-400',
    grass: 'bg-green-500',
    ice: 'bg-cyan-300',
    fighting: 'bg-red-700',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-600',
    flying: 'bg-indigo-400',
    psychic: 'bg-pink-500',
    bug: 'bg-lime-500',
    rock: 'bg-yellow-800',
    ghost: 'bg-purple-700',
    dragon: 'bg-indigo-600',
    steel: 'bg-gray-500',
    fairy: 'bg-pink-300',
  };

  // Fetch Pokemon data whenever the ID from the URL changes
  useEffect(() => {
    fetchPokemon(id!)
      .then(setPokemon)
      .catch(() => {
        setError('Pokémon not found');
        showMessage('Failed to load Pokémon data', 'error');
      });
  }, [id, showMessage]);

  if (error) return <div className="text-center p-8 text-red-500 font-bold">{error}</div>;
  if (!pokemon)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );

  const mainType = pokemon.types[0].type.name;
  const bgColor = typeColors[mainType] || 'bg-gray-500';

  /**
   * Determines the color class for a stat bar based on its value
   * Uses a 10-step gradient from red (low) to green (high)
   * @param value - The base stat value (0-255)
   * @returns Tailwind CSS background color class
   */
  const getStatColor = (value: number) => {
    if (value >= 150) return 'bg-green-600'; // Top tier
    if (value >= 120) return 'bg-green-500'; // Excellent
    if (value >= 100) return 'bg-green-400'; // Great
    if (value >= 90) return 'bg-lime-400'; // Good
    if (value >= 80) return 'bg-yellow-400'; // Above Average
    if (value >= 70) return 'bg-amber-500'; // Average
    if (value >= 60) return 'bg-orange-500'; // Below Average
    if (value >= 50) return 'bg-red-400'; // Weak
    if (value >= 30) return 'bg-red-500'; // Poor
    return 'bg-red-600'; // Very Poor
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fadeInUp">
      <div
        className={`relative ${bgColor} rounded-b-[3rem] shadow-lg mb-20 pt-8 pb-24 px-8 text-white overflow-visible`}
      >
        <Link
          to="/"
          className="absolute top-8 left-8 text-white/80 hover:text-white transition-colors flex items-center gap-2 font-medium"
        >
          ← Back to List
        </Link>

        <div className="flex justify-between items-start mt-8">
          <div>
            <h1 className="text-5xl font-bold capitalize mb-2 tracking-tight">{pokemon.name}</h1>
            <div className="flex gap-3">
              {pokemon.types.map((t) => (
                <span
                  key={t.type.name}
                  className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-semibold capitalize"
                >
                  {t.type.name}
                </span>
              ))}
            </div>
          </div>
          <div className="text-2xl font-bold opacity-80 -mt-8">
            #{String(pokemon.id).padStart(3, '0')}
          </div>
        </div>

        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 z-10">
          <img
            src={pokemon.sprites.other['official-artwork'].front_default}
            alt={pokemon.name}
            width={280}
            height={280}
            className="drop-shadow-2xl hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="absolute bottom-4 right-8">
          <FavoriteButton id={pokemon.id} name={pokemon.name} tooltipPosition="top" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 mt-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <span className="w-1 h-6 bg-red-500 rounded-full"></span>
            Base Stats
          </h3>
          <div className="space-y-4">
            {pokemon.stats
              .filter((s) =>
                ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'].includes(
                  s.stat.name
                )
              )
              .map((s) => (
                <div key={s.stat.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize text-gray-500 font-medium">
                      {s.stat.name.replace('-', ' ')}
                    </span>
                    <span className="font-bold text-gray-800">{s.base_stat}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getStatColor(s.base_stat)}`}
                      style={{ width: `${Math.min(s.base_stat, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
            Moves
          </h3>
          <div className="flex flex-wrap gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {pokemon.moves.slice(0, 20).map((m) => (
              <span
                key={m.move.name}
                className="bg-gray-50 text-gray-600 px-3 py-1 rounded-lg text-sm border border-gray-200 capitalize hover:bg-gray-100 transition-colors"
              >
                {m.move.name.replace('-', ' ')}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
