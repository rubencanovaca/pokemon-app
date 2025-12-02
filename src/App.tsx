import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';
import { MessageProvider } from './context/MessageContext';
import { ShowMessage } from './components/ShowMessage';
import PokemonList from './pages/PokemonList';
import DetailPage from './pages/DetailPage';
import FavoritesPage from './pages/FavoritesPage';

function Navigation() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isFavorites = location.pathname === '/favorites';

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-md bg-white/70 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/pokeball.png"
              alt="Pokeball"
              className="h-8 w-8 transform group-hover:rotate-180 transition-transform duration-500"
            />
            <span className="font-bold text-xl bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
              PokéApp
            </span>
          </Link>
          <div className="flex gap-6">
            <Link
              to="/"
              className={`${isHome ? 'text-red-600' : 'text-gray-600 hover:text-red-600'} font-medium transition-colors duration-200`}
            >
              List
            </Link>
            <Link
              to="/favorites"
              className={`${isFavorites ? 'text-red-600' : 'text-gray-600 hover:text-red-600'} font-medium transition-colors duration-200`}
            >
              Favorites
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

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
          <Navigation />
          <div className="pt-6">
            <Routes>
              <Route path="/" element={<PokemonList />} />
              <Route path="/pokemon/:id" element={<DetailPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
            </Routes>
          </div>
        </Router>
        <ShowMessage />
      </FavoritesProvider>
    </MessageProvider>
  );
}
