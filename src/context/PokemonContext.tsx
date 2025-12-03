import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

/**
 * Simplified Pokemon data for displaying in the list view
 */
export type PokemonPreview = {
  /** Pokemon's unique ID */
  id: number;
  /** Pokemon's name */
  name: string;
  /** Array of type names for this Pokemon */
  types: string[];
};

/**
 * Type definition for the Pokemon context
 * Manages the list of loaded Pokemon, pagination state, and scroll position
 */
interface PokemonContextType {
  /** Array of currently loaded Pokemon previews */
  pokemonList: PokemonPreview[];
  /** Function to update the Pokemon list */
  setPokemonList: Dispatch<SetStateAction<PokemonPreview[]>>;
  /** Current page number for pagination */
  page: number;
  /** Function to update the current page */
  setPage: Dispatch<SetStateAction<number>>;
  /** Boolean indicating if there are more Pokemon to load */
  hasMore: boolean;
  /** Function to update the hasMore state */
  setHasMore: Dispatch<SetStateAction<boolean>>;
  /** Saved scroll position for the list view */
  scrollPosition: number;
  /** Function to update the saved scroll position */
  setScrollPosition: Dispatch<SetStateAction<number>>;
}

/**
 * Context object for accessing Pokemon list state
 */
const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

/**
 * Provider component that manages the global Pokemon list state
 * Handles state for the list, pagination, and scroll position
 * @param children - React child components that will have access to the Pokemon context
 * @param initialState - Optional initial state for testing or hydration
 */
export function PokemonProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: Partial<PokemonContextType>;
}) {
  const [pokemonList, setPokemonList] = useState<PokemonPreview[]>(initialState?.pokemonList || []);
  const [page, setPage] = useState(initialState?.page || 0);
  const [hasMore, setHasMore] = useState(initialState?.hasMore ?? true);
  const [scrollPosition, setScrollPosition] = useState(initialState?.scrollPosition || 0);

  return (
    <PokemonContext.Provider
      value={{
        pokemonList,
        setPokemonList,
        page,
        setPage,
        hasMore,
        setHasMore,
        scrollPosition,
        setScrollPosition,
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
}

/**
 * Custom hook to access the Pokemon context
 * Provides access to the Pokemon list, pagination, and scroll state
 * @returns The Pokemon context containing list state and setters
 * @throws Error if used outside of PokemonProvider
 */
export function usePokemon() {
  const context = useContext(PokemonContext);
  if (context === undefined) {
    throw new Error('usePokemon must be used within a PokemonProvider');
  }
  return context;
}
