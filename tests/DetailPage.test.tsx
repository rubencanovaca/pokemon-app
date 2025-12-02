import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import DetailPage from '../src/pages/DetailPage';
import { FavoritesProvider } from '../src/context/FavoritesContext';
import { MessageProvider } from '../src/context/MessageContext';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import * as api from '../src/utils/api';

// Mock the API
jest.mock('../src/utils/api');
const mockFetchPokemon = api.fetchPokemon as jest.Mock;

const renderWithProviders = (ui: React.ReactElement, { route = '/pokemon/1' } = {}) => {
  return render(
    <MessageProvider>
      <FavoritesProvider>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path="/pokemon/:id" element={ui} />
            <Route path="/" element={<div>Home Page</div>} />
          </Routes>
        </MemoryRouter>
      </FavoritesProvider>
    </MessageProvider>
  );
};

const mockPokemonData = {
  id: 1,
  name: 'bulbasaur',
  sprites: {
    other: {
      'official-artwork': {
        front_default: 'bulbasaur.png',
      },
    },
  },
  types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
  moves: [{ move: { name: 'razor-wind' } }],
  stats: [
    { stat: { name: 'hp' }, base_stat: 45 },
    { stat: { name: 'attack' }, base_stat: 49 },
  ],
};

describe('DetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    // Return a promise that never resolves to test loading state
    mockFetchPokemon.mockImplementation(() => new Promise(() => { }));
    renderWithProviders(<DetailPage />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  test('renders pokemon details correctly', async () => {
    mockFetchPokemon.mockResolvedValue(mockPokemonData);
    renderWithProviders(<DetailPage />);

    await waitFor(() => {
      expect(screen.getByText(/#1 Bulbasaur/i)).toBeInTheDocument();
    });

    expect(screen.getByText('grass')).toBeInTheDocument();
    expect(screen.getByText('poison')).toBeInTheDocument();
    expect(screen.getByText(/hp: 45/i)).toBeInTheDocument();
    expect(screen.getByText('razor-wind')).toBeInTheDocument();

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'bulbasaur.png');
    expect(img).toHaveAttribute('alt', 'bulbasaur');
  });

  test('handles error state', async () => {
    mockFetchPokemon.mockRejectedValue(new Error('Not found'));
    renderWithProviders(<DetailPage />);

    await waitFor(() => {
      expect(screen.getByText(/Pokémon not found/i)).toBeInTheDocument();
    });
  });

  test('back link navigates to home', async () => {
    mockFetchPokemon.mockResolvedValue(mockPokemonData);
    renderWithProviders(<DetailPage />);

    await waitFor(() => {
      expect(screen.getByText(/#1 Bulbasaur/i)).toBeInTheDocument();
    });

    const backLink = screen.getByText(/< Back/i);
    fireEvent.click(backLink);

    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  test('favorite button toggles state', async () => {
    mockFetchPokemon.mockResolvedValue(mockPokemonData);
    renderWithProviders(<DetailPage />);

    await waitFor(() => {
      expect(screen.getByText(/#1 Bulbasaur/i)).toBeInTheDocument();
    });

    const favBtn = screen.getByRole('button');
    expect(favBtn).toHaveTextContent('☆'); // Not favorite initially

    fireEvent.click(favBtn);
    expect(favBtn).toHaveTextContent('★'); // Favorite

    fireEvent.click(favBtn);
    expect(favBtn).toHaveTextContent('☆'); // Unfavorite
  });
});
