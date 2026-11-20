import { useState } from 'react';
import { useLibrary } from '../context/libraryContext';
import MoviePoster from './MoviePoster';

const Favoritos = () => {
  const { favorites, removeFromFavorites, addToLibrary, isInLibrary } = useLibrary();
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
              <div className="movie-card favorite" key={m.imdbID}>
                <div className="movie-poster-wrap">
                  <MoviePoster src={m.poster} alt={m.title} />
                  <div className="fav-heart-badge">❤️</div>
                </div>

                <div className="movie-info">
                  <h3 className="movie-title">{m.title}</h3>
                  <p className="movie-meta">{m.year} · {m.type}</p>
                  <p className="movie-added">Guardada: {m.addedAt}</p>
                </div>

                <div className="movie-actions">
                  <button
                    className={`action-btn ${isInLibrary(m.imdbID) ? 'secondary' : 'success'}`}
                    onClick={() => addToLibrary(m)}
                    disabled={isInLibrary(m.imdbID)}
                    title="Agregar a mi lista"
                  >
                    {isInLibrary(m.imdbID) ? '✅ En lista' : '➕ Mi lista'}
                  </button>
                  <button
                    className="action-btn danger"
                    onClick={() => removeFromFavorites(m.imdbID)}
                    title="Quitar de favoritos"
                  >
                    🗑
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
