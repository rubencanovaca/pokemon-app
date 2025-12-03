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

interface PokemonContextType {
  pokemonList: PokemonPreview[];
  setPokemonList: Dispatch<SetStateAction<PokemonPreview[]>>;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  hasMore: boolean;
  setHasMore: Dispatch<SetStateAction<boolean>>;
  scrollPosition: number;
  setScrollPosition: Dispatch<SetStateAction<number>>;
}

const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

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

export function usePokemon() {
  const context = useContext(PokemonContext);
  if (context === undefined) {
    throw new Error('usePokemon must be used within a PokemonProvider');
  }
  return context;
}
