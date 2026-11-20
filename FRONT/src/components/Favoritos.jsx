import { useState } from 'react';
import { useLibrary } from '../context/libraryContext';
import MoviePoster from './MoviePoster';
import { posterUrl } from '../services/movieService.js';

const Favoritos = () => {
  const { favorites, removeFromFavorites, isInLibrary } = useLibrary();
  const [search, setSearch] = useState('');

  const filtered = favorites.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-content">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Favoritos</h1>
          <p className="page-subtitle">
            {favorites.length} película{favorites.length !== 1 ? 's' : ''} favorita{favorites.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-hero">
          <div className="empty-icon">❤️</div>
          <h3>Todavía no tenés favoritos</h3>
          <p>Cuando busques películas, podés marcarlas con ❤️ para guardarlas acá.</p>
        </div>
      ) : (
        <>
          <div className="list-controls">
            <input
              className="list-search"
              type="text"
              placeholder="Filtrar favoritos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filtered.length === 0 && (
            <div className="empty-hero small">
              <div className="empty-icon">🤷</div>
              <h3>No coincide ninguna</h3>
            </div>
          )}

          <div className="movie-grid">
            {filtered.map((m) => (
              <div className="movie-card favorite" key={m.tmdb_id}>
                <div className="movie-poster-wrap">
                  <MoviePoster src={posterUrl(m.poster_path)} alt={m.title} />
                  <div className="fav-heart-badge">❤️</div>
                </div>

                <div className="movie-info">
                  <h3 className="movie-title">{m.title}</h3>
                  {m.state && (
                    <p className="movie-meta">{m.state.replace('_', ' ')}</p>
                  )}
                  <p className="movie-added">
                    Guardada: {m.created_at ? m.created_at.slice(0, 10) : '—'}
                  </p>
                </div>

                <div className="movie-actions">
                  <button
                    className="action-btn danger"
                    onClick={() => removeFromFavorites(m.tmdb_id)}
                    title="Quitar de favoritos"
                  >
                    🗑 Quitar favorito
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Favoritos;
