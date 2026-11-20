import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useLibrary } from '../context/libraryContext';
import MoviePoster from './MoviePoster';
import { getPopularMovies, posterUrl } from '../services/movieService.js';

const Dashboard = () => {
  const { user } = useAuth();
  const {
    library,
    favorites,
    addToLibrary,
    addToFavorites,
    isInLibrary,
    isInFavorites,
  } = useLibrary();

  const [trending, setTrending] = useState([]);

  useEffect(() => {
    getPopularMovies()
      .then((movies) => setTrending(movies.slice(0, 8)))
      .catch((err) => console.error('Error cargando populares:', err.message));
  }, []);

  const watched = library.filter((e) => e.state === 'vista').length;
  const pending = library.filter((e) => e.state === 'quiero_ver').length;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 19) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const handleLibraryToggle = async (m) => {
    try {
      if (!isInLibrary(m.id)) {
        await addToLibrary(m);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleFavToggle = async (m) => {
    try {
      if (!isInFavorites(m.id)) {
        await addToFavorites(m);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="dashboard">
      {/* Welcome */}
      <div className="dashboard-welcome">
        <div>
          <p className="welcome-greeting">{greeting()},</p>
          <h1 className="welcome-name">{user?.username || 'Cinéfilo'} 🎬</h1>
        </div>
        <Link to="/app/buscar" className="cta-primary">Buscar películas</Link>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div>
            <div className="stat-value">{library.length}</div>
            <div className="stat-label">En mi lista</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div>
            <div className="stat-value">{watched}</div>
            <div className="stat-label">Vistas</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div>
            <div className="stat-value">{pending}</div>
            <div className="stat-label">Quiero ver</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❤️</div>
          <div>
            <div className="stat-value">{favorites.length}</div>
            <div className="stat-label">Favoritas</div>
          </div>
        </div>
      </div>

      {/* Trending */}
      {trending.length > 0 && (
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Populares ahora</h2>
            <Link to="/app/buscar" className="section-link">Ver más →</Link>
          </div>
          <div className="movie-grid">
            {trending.map((m) => (
              <div className="movie-card" key={m.id}>
                <div className="movie-poster-wrap">
                  <MoviePoster src={posterUrl(m.poster_path)} alt={m.title} />
                  <div className="movie-overlay">
                    <button
                      className={`overlay-btn ${isInLibrary(m.id) ? 'added' : ''}`}
                      onClick={() => handleLibraryToggle(m)}
                      title="Agregar a mi lista"
                    >
                      {isInLibrary(m.id) ? '✅' : '➕'} Lista
                    </button>
                    <button
                      className={`overlay-btn fav ${isInFavorites(m.id) ? 'added' : ''}`}
                      onClick={() => handleFavToggle(m)}
                      title="Agregar a favoritos"
                    >
                      {isInFavorites(m.id) ? '❤️' : '🤍'} Fav
                    </button>
                  </div>
                </div>
                <div className="movie-info">
                  <h3 className="movie-title">{m.title}</h3>
                  <p className="movie-meta">
                    {m.release_date ? m.release_date.slice(0, 4) : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Seguir viendo */}
      {library.length > 0 && (
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Mi lista reciente</h2>
            <Link to="/app/lista" className="section-link">Ver todo →</Link>
          </div>
          <div className="movie-grid">
            {library.slice(0, 4).map((m) => (
              <div className="movie-card" key={m.tmdb_id}>
                <div className="movie-poster-wrap">
                  <MoviePoster src={posterUrl(m.poster_path)} alt={m.title} />
                  <div className="movie-status-badge">
                    {m.state === 'vista' ? '✅ Vista' : m.state === 'viendo' ? '▶️ Viendo' : '⏳ Pendiente'}
                  </div>
                </div>
                <div className="movie-info">
                  <h3 className="movie-title">{m.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
