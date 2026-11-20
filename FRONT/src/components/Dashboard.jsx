import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useLibrary } from '../context/libraryContext';
import MoviePoster from './MoviePoster';

// Posters via TMDB image CDN (libre de hotlinking, no requiere API key)
const TRENDING = [
  { title: 'Oppenheimer', year: '2023', poster: 'https://image.tmdb.org/t/p/w300/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', imdbID: 'tt15398776' },
  { title: 'Dune: Part Two', year: '2024', poster: 'https://image.tmdb.org/t/p/w300/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg', imdbID: 'tt15239678' },
  { title: 'Poor Things', year: '2023', poster: 'https://image.tmdb.org/t/p/w300/saHP97rTPS5eLmrLQEcANmKrsFl.jpg', imdbID: 'tt14230458' },
  { title: 'Barbie', year: '2023', poster: 'https://image.tmdb.org/t/p/w300/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg', imdbID: 'tt1517268' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const { library, favorites, addToLibrary, addToFavorites, isInLibrary, isInFavorites } = useLibrary();

  const watched = library.filter((e) => e.status === 'watched').length;
  const pending = library.filter((e) => e.status === 'pending').length;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 19) return 'Buenas tardes';
    return 'Buenas noches';
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
            <div className="stat-label">Pendientes</div>
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
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Tendencias</h2>
          <Link to="/app/buscar" className="section-link">Ver más →</Link>
        </div>
        <div className="movie-grid">
          {TRENDING.map((m) => (
            <div className="movie-card" key={m.imdbID}>
              <div className="movie-poster-wrap">
                <MoviePoster src={m.poster} alt={m.title} />
                <div className="movie-overlay">
                  <button
                    className={`overlay-btn ${isInLibrary(m.imdbID) ? 'added' : ''}`}
                    onClick={() => addToLibrary(m)}
                    title="Agregar a mi lista"
                  >
                    {isInLibrary(m.imdbID) ? '✅' : '➕'} Lista
                  </button>
                  <button
                    className={`overlay-btn fav ${isInFavorites(m.imdbID) ? 'added' : ''}`}
                    onClick={() => addToFavorites(m)}
                    title="Agregar a favoritos"
                  >
                    {isInFavorites(m.imdbID) ? '❤️' : '🤍'} Fav
                  </button>
                </div>
              </div>
              <div className="movie-info">
                <h3 className="movie-title">{m.title}</h3>
                <p className="movie-meta">{m.year}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick access */}
      {library.length > 0 && (
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Seguir viendo</h2>
            <Link to="/app/lista" className="section-link">Ver todo →</Link>
          </div>
          <div className="movie-grid">
            {library.slice(0, 4).map((m) => (
              <div className="movie-card" key={m.imdbID}>
                <div className="movie-poster-wrap">
                  <MoviePoster src={m.poster} alt={m.title} />
                  <div className="movie-status-badge">
                    {m.status === 'watched' ? '✅ Vista' : '⏳ Pendiente'}
                  </div>
                </div>
                <div className="movie-info">
                  <h3 className="movie-title">{m.title}</h3>
                  <p className="movie-meta">{m.year}</p>
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
