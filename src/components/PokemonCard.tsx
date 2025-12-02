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
  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-md min-w-[280px] min-h-[120px] gap-4">
      <Link to={`/pokemon/${id}`} className="flex items-center gap-4 no-underline text-gray-800">
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
          alt={name}
          width={96}
          height={96}
        />
        <div>
          <h3 className="text-lg font-semibold mb-2">
            #{id} {name.charAt(0).toUpperCase() + name.slice(1)}
          </h3>
          <div className="flex gap-2">
            {types.map((t) => (
              <span key={t} className="rounded px-2 py-1 bg-gray-200 capitalize text-sm">
                {t}
              </span>
            ))}
          </div>
        </div>
      </Link>
      <FavoriteButton id={id} name={name} />
    </div>
  );
}
