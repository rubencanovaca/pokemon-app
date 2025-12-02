/** Base URL for the PokeAPI v2 */
const API_URL = 'https://pokeapi.co/api/v2';

/**
 * Fetches a paginated list of Pokemon from the PokeAPI
 * @param offset - The starting index for pagination (default: 0)
 * @param limit - The number of Pokemon to fetch (default: 20)
 * @returns Promise resolving to the API response with results array and pagination info
 */
export async function fetchPokemonList(offset: number = 0, limit: number = 20) {
  const res = await fetch(`${API_URL}/pokemon?offset=${offset}&limit=${limit}`);
  const data = await res.json();
  return data;
}

/**
 * Fetches detailed information for a specific Pokemon
 * @param idOrName - The Pokemon's ID (number) or name (string)
 * @returns Promise resolving to the Pokemon's detailed data
 * @throws Error if the Pokemon is not found (404 response)
 */
export async function fetchPokemon(idOrName: string | number) {
  const res = await fetch(`${API_URL}/pokemon/${idOrName}`);
  if (!res.ok) throw new Error('Pokemon not found');
  return res.json();
}
