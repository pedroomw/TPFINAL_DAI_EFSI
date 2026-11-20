import { useAuth } from '../context/authContext';
import { useLibrary } from '../context/libraryContext';
import { useNavigate } from 'react-router-dom';
import MoviePoster from './MoviePoster';

const Perfil = () => {
  const { user, logout } = useAuth();
  const { library, favorites } = useLibrary();
  const navigate = useNavigate();

  const watched = library.filter((e) => e.status === 'watched').length;
  const pending = library.filter((e) => e.status === 'pending').length;

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  // Géneros simulados (TODO: calcular de la API)
  const topGenres = ['Drama', 'Ciencia ficción', 'Thriller'];

  return (
    <div className="page-content">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Mi perfil</h1>
          <p className="page-subtitle">Tu actividad en CineTrack</p>
        </div>
      </div>

      {/* Perfil card */}
      <div className="profile-card">
        <div className="profile-avatar-big">{user?.avatar || user?.email?.[0]?.toUpperCase() || 'U'}</div>
        <div className="profile-info">
          <h2 className="profile-username">{user?.username || 'Usuario'}</h2>
          <p className="profile-email">{user?.email}</p>
          <div className="profile-badges">
            <span className="profile-badge">🎬 Cinéfilo</span>
            {watched >= 10 && <span className="profile-badge gold">🏆 Top 10</span>}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card big">
          <div className="stat-icon">📋</div>
          <div>
            <div className="stat-value">{library.length}</div>
            <div className="stat-label">En mi lista</div>
          </div>
        </div>
        <div className="stat-card big">
          <div className="stat-icon">✅</div>
          <div>
            <div className="stat-value">{watched}</div>
            <div className="stat-label">Películas vistas</div>
          </div>
        </div>
        <div className="stat-card big">
          <div className="stat-icon">⏳</div>
          <div>
            <div className="stat-value">{pending}</div>
            <div className="stat-label">Pendientes</div>
          </div>
        </div>
        <div className="stat-card big">
          <div className="stat-icon">❤️</div>
          <div>
            <div className="stat-value">{favorites.length}</div>
            <div className="stat-label">Favoritas</div>
          </div>
        </div>
      </div>

      {/* Géneros (hardcodeado por ahora) */}
      <div className="profile-section">
        <h3>Géneros favoritos</h3>
        <div className="genre-tags">
          {topGenres.map((g) => (
            <span key={g} className="genre-tag">{g}</span>
          ))}
          <span className="genre-tag muted">+ más cuando uses la app</span>
        </div>
      </div>

      {/* Actividad reciente */}
      {library.length > 0 && (
        <div className="profile-section">
          <h3>Últimas agregadas</h3>
          <div className="recent-list">
            {library.slice(0, 5).map((m) => (
              <div className="recent-item" key={m.imdbID}>
                <MoviePoster src={m.poster} alt={m.title} className="recent-poster" />
                <div className="recent-info">
                  <span className="recent-title">{m.title}</span>
                  <span className="recent-meta">{m.year} · {m.addedAt}</span>
                </div>
                <div className={`recent-status ${m.status}`}>
                  {m.status === 'watched' ? '✅ Vista' : '⏳ Pendiente'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="profile-section">
        <button className="btn-danger" onClick={handleLogout}>
          🚪 Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Perfil;
