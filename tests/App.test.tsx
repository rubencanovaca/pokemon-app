import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../src/App';

// Mock page components
jest.mock('../src/pages/PokemonList', () => () => (
  <div data-testid="pokemon-list">Pokemon List Page</div>
));
jest.mock('../src/pages/DetailPage', () => () => <div data-testid="detail-page">Detail Page</div>);
jest.mock('../src/pages/FavoritesPage', () => () => (
  <div data-testid="favorites-page">Favorites Page</div>
));

describe('App Navigation', () => {
  test('highlights active link correctly', () => {
    render(<App />);

    // Initial State (Home Page)
    expect(screen.getByTestId('pokemon-list')).toBeInTheDocument();

    const listLink = screen.getByRole('link', { name: /list/i });
    const favoritesLink = screen.getByRole('link', { name: /favorites/i });

    // List link should be active (red)
    expect(listLink).toHaveClass('text-red-600');
    expect(listLink).not.toHaveClass('text-gray-600');

    // Favorites link should be inactive (gray)
    expect(favoritesLink).toHaveClass('text-gray-600');
    expect(favoritesLink).not.toHaveClass('text-red-600');

    // Navigate to Favorites
    fireEvent.click(favoritesLink);

    // Check Favorites Page
    expect(screen.getByTestId('favorites-page')).toBeInTheDocument();

    // Favorites link should be active (red)
    expect(favoritesLink).toHaveClass('text-red-600');
    expect(favoritesLink).not.toHaveClass('text-gray-600');

    // List link should be inactive (gray)
    expect(listLink).toHaveClass('text-gray-600');
    expect(listLink).not.toHaveClass('text-red-600');
  });
});
