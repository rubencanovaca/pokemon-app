import React from 'react';
import { Link } from 'react-router-dom';
import { FavoriteButton } from './FavoriteButton';

/**
 * Props for the PokemonCard component
 */
type PokemonCardProps = {
  /** The Pokemon's unique ID */
  id: number;
  /** The Pokemon's name */
  name: string;
  /** Array of type names for this Pokemon (e.g., ['fire', 'flying']) */
  types: string[];
};

/**
 * Displays a Pokemon card with image, name, ID, types, and favorite button
 * The card is clickable and links to the Pokemon's detail page
 * @param props - The Pokemon card properties
 */
export function PokemonCard({ id, name, types }: PokemonCardProps) {
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

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      <div className="absolute top-0 right-0 p-4 z-20">
        <FavoriteButton id={id} name={name} tooltipPosition="left" />
      </div>

      <Link to={`/pokemon/${id}`} className="block p-6 overflow-hidden rounded-2xl">
        <div className="relative flex justify-center mb-4">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
            alt={name}
            width={120}
            height={120}
            className="relative z-10 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-md"
          />
        </div>

        <div className="text-center">
          <span className="text-sm font-medium text-gray-400">#{String(id).padStart(3, '0')}</span>
          <h3 className="text-xl font-bold text-gray-800 mb-3 capitalize tracking-tight">{name}</h3>

          <div className="flex justify-center gap-2 flex-wrap">
            {types.map((t) => (
              <span
                key={t}
                className={`${typeColors[t] || 'bg-gray-400'} text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm capitalize tracking-wide`}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}
