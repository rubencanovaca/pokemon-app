import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FavoriteButton } from '../src/components/FavoriteButton';
import { ShowMessage } from '../src/components/ShowMessage';
import { FavoritesProvider } from '../src/context/FavoritesContext';
import { MessageProvider } from '../src/context/MessageContext';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <MessageProvider>
      <FavoritesProvider>{ui}</FavoritesProvider>
    </MessageProvider>
  );
};

describe('FavoriteButton', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders empty star when not favorited', () => {
    renderWithProviders(<FavoriteButton id={1} name="bulbasaur" />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('☆');
  });

  test('renders filled star when favorited', () => {
    // Pre-populate favorites
    localStorage.setItem('favorites', JSON.stringify([1]));
    renderWithProviders(<FavoriteButton id={1} name="bulbasaur" />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('★');
  });

  test('toggles favorite status when clicked', () => {
    renderWithProviders(<FavoriteButton id={1} name="bulbasaur" />);
    const button = screen.getByRole('button');

    // Initially not favorited
    expect(button).toHaveTextContent('☆');

    // Click to favorite
    fireEvent.click(button);
    expect(button).toHaveTextContent('★');

    // Click to unfavorite
    fireEvent.click(button);
    expect(button).toHaveTextContent('☆');
  });

  test('stops event propagation when clicked', () => {
    const parentClickHandler = jest.fn();
    const { container } = renderWithProviders(
      <div onClick={parentClickHandler}>
        <FavoriteButton id={1} name="bulbasaur" />
      </div>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Parent handler should not be called due to stopPropagation
    expect(parentClickHandler).not.toHaveBeenCalled();
  });

  test('persists favorite status in localStorage', () => {
    renderWithProviders(<FavoriteButton id={25} name="pikachu" />);
    const button = screen.getByRole('button');

    // Click to favorite
    fireEvent.click(button);

    // Check localStorage
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    expect(favorites).toContain(25);
  });

  test('works with multiple Pokemon IDs', () => {
    const { rerender } = renderWithProviders(<FavoriteButton id={1} name="bulbasaur" />);
    const button1 = screen.getByRole('button');
    fireEvent.click(button1);
    expect(button1).toHaveTextContent('★');

    // Render different Pokemon
    rerender(
      <MessageProvider>
        <FavoritesProvider>
          <FavoriteButton id={2} name="ivysaur" />
        </FavoritesProvider>
      </MessageProvider>
    );
    const button2 = screen.getByRole('button');
    expect(button2).toHaveTextContent('☆'); // Not favorited

    // First Pokemon should still be favorited
    rerender(
      <MessageProvider>
        <FavoritesProvider>
          <FavoriteButton id={1} name="bulbasaur" />
        </FavoritesProvider>
      </MessageProvider>
    );
    const button1Again = screen.getByRole('button');
    expect(button1Again).toHaveTextContent('★');
  });
  test('shows personalized message when toggling', async () => {
    renderWithProviders(
      <>
        <ShowMessage />
        <FavoriteButton id={1} name="bulbasaur" />
      </>
    );
    const button = screen.getByRole('button');

    // Click to favorite
    fireEvent.click(button);
    expect(await screen.findByText('Bulbasaur added to favorites')).toBeInTheDocument();

    // Click to unfavorite
    fireEvent.click(button);
    expect(await screen.findByText('Bulbasaur removed from favorites')).toBeInTheDocument();
  });
  test('has cursor-pointer class', () => {
    renderWithProviders(<FavoriteButton id={1} name="bulbasaur" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('cursor-pointer');
  });
  test('shows tooltip text', () => {
    renderWithProviders(<FavoriteButton id={1} name="bulbasaur" />);
    // Tooltip text should be present in the document (even if hidden by opacity)
    expect(screen.getByText('Add to favorites')).toBeInTheDocument();
  });
});
