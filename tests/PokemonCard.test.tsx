import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PokemonCard } from '../src/components/PokemonCard';
import { FavoritesProvider } from '../src/context/FavoritesContext';
import { MessageProvider } from '../src/context/MessageContext';

const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <MessageProvider>
            <FavoritesProvider>
                <BrowserRouter>{ui}</BrowserRouter>
            </FavoritesProvider>
        </MessageProvider>
    );
};

describe('PokemonCard', () => {
    const mockPokemon = {
        id: 25,
        name: 'pikachu',
        types: ['electric'],
    };

    beforeEach(() => {
        localStorage.clear();
    });

    test('renders Pokemon name with proper capitalization', () => {
        renderWithProviders(<PokemonCard {...mockPokemon} />);
        expect(screen.getByText(/#25 Pikachu/i)).toBeInTheDocument();
    });

    test('renders Pokemon ID', () => {
        renderWithProviders(<PokemonCard {...mockPokemon} />);
        expect(screen.getByText(/#25 Pikachu/i)).toBeInTheDocument();
    });

    test('renders Pokemon image with correct src and alt', () => {
        renderWithProviders(<PokemonCard {...mockPokemon} />);
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute(
            'src',
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
        );
        expect(img).toHaveAttribute('alt', 'pikachu');
    });

    test('renders all Pokemon types', () => {
        const multiTypePokemon = {
            id: 6,
            name: 'charizard',
            types: ['fire', 'flying'],
        };
        renderWithProviders(<PokemonCard {...multiTypePokemon} />);
        expect(screen.getByText('fire')).toBeInTheDocument();
        expect(screen.getByText('flying')).toBeInTheDocument();
    });

    test('renders single type Pokemon', () => {
        renderWithProviders(<PokemonCard {...mockPokemon} />);
        expect(screen.getByText('electric')).toBeInTheDocument();
    });

    test('renders FavoriteButton', () => {
        renderWithProviders(<PokemonCard {...mockPokemon} />);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent('☆'); // Not favorited initially
    });

    test('has link to detail page', () => {
        renderWithProviders(<PokemonCard {...mockPokemon} />);
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/pokemon/25');
    });

    test('renders with different Pokemon IDs', () => {
        const bulbasaur = {
            id: 1,
            name: 'bulbasaur',
            types: ['grass', 'poison'],
        };
        renderWithProviders(<PokemonCard {...bulbasaur} />);

        expect(screen.getByText(/#1 Bulbasaur/i)).toBeInTheDocument();
        expect(screen.getByText('grass')).toBeInTheDocument();
        expect(screen.getByText('poison')).toBeInTheDocument();

        const img = screen.getByRole('img');
        expect(img).toHaveAttribute(
            'src',
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'
        );
    });

    test('applies correct CSS classes', () => {
        const { container } = renderWithProviders(<PokemonCard {...mockPokemon} />);
        const card = container.firstChild;
        expect(card).toHaveClass('flex', 'items-center', 'p-4', 'bg-white', 'rounded-lg', 'shadow-md');
    });

    test('handles Pokemon names with special characters', () => {
        const nidoranF = {
            id: 29,
            name: 'nidoran-f',
            types: ['poison'],
        };
        renderWithProviders(<PokemonCard {...nidoranF} />);
        expect(screen.getByText(/#29 Nidoran-f/i)).toBeInTheDocument();
    });
});
