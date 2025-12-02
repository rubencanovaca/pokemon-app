import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';
import { MessageProvider } from './context/MessageContext';
import { ShowMessage } from './components/ShowMessage';
import PokemonList from './pages/PokemonList';
import DetailPage from './pages/DetailPage';
import FavoritesPage from './pages/FavoritesPage';

/**
 * Root application component
 * Sets up routing with React Router and wraps the app in the FavoritesProvider
 * Provides navigation between Pokemon list, detail pages, and favorites
 */
export default function App() {
  return (
    <MessageProvider>
      <FavoritesProvider>
        <Router>
          <nav className="bg-red-600 text-white font-bold flex justify-center gap-4 p-4">
            <Link to="/" className="hover:underline">
              Pokémon List
            </Link>
            <Link to="/favorites" className="hover:underline">
              Favorites
            </Link>
          </nav>
          <main className="p-8 max-w-4xl mx-auto">
            <Routes>
              <Route path="/" element={<PokemonList />} />
              <Route path="/pokemon/:id" element={<DetailPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
            </Routes>
          </main>
        </Router>
        <ShowMessage />
      </FavoritesProvider>
    </MessageProvider>
  );
}
