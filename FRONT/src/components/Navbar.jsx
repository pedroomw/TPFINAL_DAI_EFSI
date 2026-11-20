import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useLibrary } from '../context/libraryContext';
import { searchMovies } from '../services/omdbService';

const Navbar = ({ onSearchResults }) => {
  const { user, logout } = useAuth();
  const { library, favorites } = useLibrary();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const pendingCount = library.filter((e) => e.status === 'pending').length;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    try {
      const results = await searchMovies(query);
      if (onSearchResults) {
        onSearchResults(results, query);
      }
      navigate('/app/buscar');
    } catch {
      // sin resultados, igual navega
      if (onSearchResults) onSearchResults([], query);
      navigate('/app/buscar');
    } finally {
      setSearching(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const navItems = [
    { to: '/app/buscar', label: 'Buscar', icon: '🔍' },
    { to: '/app/lista', label: 'Mi lista', icon: '📋', badge: pendingCount || null },
    { to: '/app/favoritos', label: 'Favoritos', icon: '❤️', badge: favorites.length || null },
    { to: '/app/perfil', label: 'Perfil', icon: '👤' },
  ];

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <NavLink to="/app" className="navbar-brand">
          <span className="brand-icon">🎬</span>
          <span className="brand-name">CineTrack</span>
        </NavLink>

        {/* Search */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <span className="navbar-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar películas, series..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {searching && <span className="navbar-search-spinner">⟳</span>}
        </form>

        {/* Nav links – desktop */}
        <nav className="navbar-links">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
            </NavLink>
          ))}
        </nav>

        {/* User menu */}
        <div className="navbar-user" onClick={() => setMenuOpen((v) => !v)}>
          <div className="user-avatar">{user?.avatar || user?.email?.[0]?.toUpperCase() || 'U'}</div>
          <span className="user-name">{user?.username || user?.email?.split('@')[0]}</span>
          <span className="chevron">{menuOpen ? '▲' : '▼'}</span>

          {menuOpen && (
            <div className="user-dropdown">
              <NavLink to="/app/perfil" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                👤 Mi perfil
              </NavLink>
              <div className="dropdown-divider" />
              <button className="dropdown-item danger" onClick={handleLogout}>
                🚪 Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
