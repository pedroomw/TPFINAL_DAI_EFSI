import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { searchMovies } from '../services/omdbService';
import { useLibrary } from '../context/libraryContext';
import MoviePoster from './MoviePoster';

const TYPE_LABELS = { movie: 'Película', series: 'Serie', episode: 'Episodio' };

const Buscar = () => {
  const context = useOutletContext() || {};
  const [query, setQuery] = useState(context.lastQuery || '');
  const [results, setResults] = useState(context.searchResults || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(!!context.lastQuery);

  const { addToLibrary, addToFavorites, isInLibrary, isInFavorites, removeFromLibrary, removeFromFavorites } = useLibrary();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const data = await searchMovies(query);
      setResults(data);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLibraryToggle = (m) => {
    if (isInLibrary(m.imdbID)) {
      removeFromLibrary(m.imdbID);
    } else {
      addToLibrary(m);
    }
  };

  const handleFavToggle = (m) => {
    if (isInFavorites(m.imdbID)) {
      removeFromFavorites(m.imdbID);
    } else {
      addToFavorites(m);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Buscar</h1>
          <p className="page-subtitle">Encontrá películas y series para tu lista</p>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <form className="search-bar" onSubmit={handleSearch}>
        <div className="search-bar-inner">
          <span className="search-bar-icon">🔍</span>
          <input
            type="text"
            placeholder="Título de película, serie..."
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
          <p>Escribí el nombre de una película o serie y la agregás a tu lista con un clic.</p>
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
          <p className="results-count">{results.length} resultado{results.length !== 1 ? 's' : ''} para <strong>"{query}"</strong></p>
          <div className="movie-grid">
            {results.map((m) => (
              <div className="movie-card" key={m.imdbID}>
                <div className="movie-poster-wrap">
                  <MoviePoster src={m.Poster} alt={m.Title} />
                  <div className="movie-overlay">
                    <button
                      className={`overlay-btn ${isInLibrary(m.imdbID) ? 'added' : ''}`}
                      onClick={() => handleLibraryToggle(m)}
                    >
                      {isInLibrary(m.imdbID) ? '✅ En lista' : '➕ Lista'}
                    </button>
                    <button
                      className={`overlay-btn fav ${isInFavorites(m.imdbID) ? 'added' : ''}`}
                      onClick={() => handleFavToggle(m)}
                    >
                      {isInFavorites(m.imdbID) ? '❤️ Favorito' : '🤍 Favorito'}
                    </button>
                  </div>
                </div>
                <div className="movie-info">
                  <h3 className="movie-title">{m.Title}</h3>
                  <p className="movie-meta">
                    {m.Year} · <span className="type-badge">{TYPE_LABELS[m.Type] || m.Type}</span>
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
