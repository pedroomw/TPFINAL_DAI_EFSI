import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies, posterUrl } from '../services/movieService.js';
import { useLibrary } from '../context/libraryContext';
import MoviePoster from './MoviePoster';

const Buscar = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const {
    addToLibrary,
    addToFavorites,
    removeFromLibrary,
    removeFromFavorites,
    isInLibrary,
    isInFavorites,
  } = useLibrary();

  // Si llega ?q= desde el navbar, ejecutar la búsqueda automáticamente
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      runSearch(q);
    }
  }, [searchParams]);

  const runSearch = async (q) => {
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const data = await searchMovies(q);
      setResults(data);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    await runSearch(query.trim());
  };

  const handleLibraryToggle = async (m) => {
    try {
      if (isInLibrary(m.id)) {
        await removeFromLibrary(m.id);
      } else {
        await addToLibrary(m);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleFavToggle = async (m) => {
    try {
      if (isInFavorites(m.id)) {
        await removeFromFavorites(m.id);
      } else {
        await addToFavorites(m);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Buscar</h1>
          <p className="page-subtitle">Encontrá películas para tu lista</p>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <form className="search-bar" onSubmit={handleSearch}>
        <div className="search-bar-inner">
          <span className="search-bar-icon">🔍</span>
          <input
            type="text"
            placeholder="Título de película..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {/* Estado vacío inicial */}
      {!searched && (
        <div className="empty-hero">
          <div className="empty-icon">🎬</div>
          <h3>¿Qué querés ver hoy?</h3>
          <p>Escribí el nombre de una película y la agregás a tu lista con un clic.</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="search-error">
          <span>😕</span> {error}
        </div>
      )}

      {/* Sin resultados */}
      {searched && !loading && !error && results.length === 0 && (
        <div className="empty-hero">
          <div className="empty-icon">🤷</div>
          <h3>Sin resultados para "{query}"</h3>
          <p>Probá con otro título o revisá la ortografía.</p>
        </div>
      )}

      {/* Resultados */}
      {results.length > 0 && (
        <>
          <p className="results-count">
            {results.length} resultado{results.length !== 1 ? 's' : ''} para{' '}
            <strong>"{query}"</strong>
          </p>
          <div className="movie-grid">
            {results.map((m) => (
              <div className="movie-card" key={m.id}>
                <div className="movie-poster-wrap">
                  <MoviePoster src={posterUrl(m.poster_path)} alt={m.title} />
                  <div className="movie-overlay">
                    <button
                      className={`overlay-btn ${isInLibrary(m.id) ? 'added' : ''}`}
                      onClick={() => handleLibraryToggle(m)}
                    >
                      {isInLibrary(m.id) ? '✅ En lista' : '➕ Lista'}
                    </button>
                    <button
                      className={`overlay-btn fav ${isInFavorites(m.id) ? 'added' : ''}`}
                      onClick={() => handleFavToggle(m)}
                    >
                      {isInFavorites(m.id) ? '❤️ Favorito' : '🤍 Favorito'}
                    </button>
                  </div>
                </div>
                <div className="movie-info">
                  <h3 className="movie-title">{m.title}</h3>
                  <p className="movie-meta">
                    {m.release_date ? m.release_date.slice(0, 4) : 'S/A'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Buscar;
