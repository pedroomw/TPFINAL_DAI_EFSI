import { useAuth } from '../context/authContext';
import { useLibrary } from '../context/libraryContext';
import { useNavigate } from 'react-router-dom';
import { posterUrl } from '../services/movieService.js';

const STATE_LABELS = {
  quiero_ver: '⏳ Quiero ver',
  viendo:     '▶️ Viendo',
  vista:      '✅ Vista',
  abandonada: '🚫 Abandonada',
};

const Perfil = () => {
  const { user, logout } = useAuth();
  const { library, favorites } = useLibrary();
  const navigate = useNavigate();

  const watched  = library.filter((e) => e.state === 'vista').length;
  const pending  = library.filter((e) => e.state === 'quiero_ver').length;

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="page-content">

      {/* Perfil card */}
      <div className="profile-card">
        <div className="profile-avatar-big">
          {user?.username?.[0]?.toUpperCase() || 'U'}
        </div>
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

      {/* Últimas agregadas */}
      {library.length > 0 && (
        <div className="profile-section">
          <h3>Últimas agregadas</h3>
          <div className="recent-list">
            {library.slice(0, 5).map((m) => {
              const poster = posterUrl(m.poster_path);
              return (
                <div className="recent-item" key={m.tmdb_id}>
                  {/* Poster pequeño */}
                  <div className="recent-poster-wrap">
                    {poster
                      ? <img src={poster} alt={m.title} className="recent-poster" />
                      : <div className="recent-poster no-poster">🎬</div>
                    }
                  </div>
                  {/* Info */}
                  <div className="recent-info">
                    <span className="recent-title">{m.title}</span>
                    <span className="recent-meta">
                      {m.created_at ? m.created_at.slice(0, 10) : ''}
                    </span>
                  </div>
                  {/* Estado */}
                  <div className={`recent-status ${m.state}`}>
                    {STATE_LABELS[m.state] || m.state}
                  </div>
                </div>
              );
            })}
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
