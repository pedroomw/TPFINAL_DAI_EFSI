import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useLibrary } from '../context/libraryContext';

const Navbar = ({ onSearchResults }) => {
  const { user, logout } = useAuth();
  const { library, favorites } = useLibrary();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const pendingCount = library.filter((e) => e.state === 'quiero_ver').length;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/app/buscar?q=${encodeURIComponent(query.trim())}`);
    setQuery('');
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
