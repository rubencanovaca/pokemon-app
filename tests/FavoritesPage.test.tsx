import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import FavoritesPage from '../src/pages/FavoritesPage';
import { FavoritesProvider, FavoritesContext } from '../src/context/FavoritesContext';
import { MessageProvider } from '../src/context/MessageContext';
import { BrowserRouter } from 'react-router-dom';
import * as api from '../src/utils/api';

// Mock the API
jest.mock('../src/utils/api');

const mockFetchPokemon = api.fetchPokemon as jest.Mock;

const renderWithProviders = (ui: React.ReactElement, providerProps = {}) => {
  return render(
    <MessageProvider>
      <FavoritesProvider {...providerProps}>
        <BrowserRouter>{ui}</BrowserRouter>
      </FavoritesProvider>
    </MessageProvider>
  );
};

describe('FavoritesPage', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders empty state when no favorites', async () => {
    renderWithProviders(<FavoritesPage />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/No favorites yet/i)).toBeInTheDocument();
  });

  test('renders favorite pokemon', async () => {
    // Setup local storage with favorites
    localStorage.setItem('favorites', JSON.stringify([1, 25]));

    mockFetchPokemon.mockResolvedValueOnce({
      id: 1,
      name: 'bulbasaur',
      types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
    });
    mockFetchPokemon.mockResolvedValueOnce({
      id: 25,
      name: 'pikachu',
      types: [{ type: { name: 'electric' } }],
    });

    renderWithProviders(<FavoritesPage />);

    await waitFor(() => {
      expect(screen.getByText(/Bulbasaur/i)).toBeInTheDocument();
      expect(screen.getByText(/Pikachu/i)).toBeInTheDocument();
    });
  });

  test('removes pokemon from favorites', async () => {
    // Setup local storage with one favorite
    localStorage.setItem('favorites', JSON.stringify([1]));

    mockFetchPokemon.mockResolvedValue({
      id: 1,
      name: 'bulbasaur',
      types: [{ type: { name: 'grass' } }],
    });

    renderWithProviders(<FavoritesPage />);

    await waitFor(() => {
      expect(screen.getByText(/Bulbasaur/i)).toBeInTheDocument();
    });

    // Find the favorite button (star) and click it
    const toggleButton = screen.getByRole('button', { name: /remove bulbasaur from favorites/i });
    fireEvent.click(toggleButton);

    // Should disappear from the list (or show empty state)
    // Note: In the current implementation of FavoritesPage, it fetches based on the list.
    // If the list changes, it might re-render.
    // However, the component uses `favorites` from hook in `useEffect` dependency.

    await waitFor(() => {
      expect(screen.queryByText(/Bulbasaur/i)).not.toBeInTheDocument();
      expect(screen.getByText(/No favorites yet/i)).toBeInTheDocument();
    });
  });
});
