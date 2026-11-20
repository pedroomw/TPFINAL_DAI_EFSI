import { useState } from 'react';
import { useLibrary } from '../context/libraryContext';
import MoviePoster from './MoviePoster';
import { posterUrl } from '../services/movieService.js';

const FILTERS = [
  { value: 'all',        label: 'Todas' },
  { value: 'quiero_ver', label: 'Quiero ver' },
  { value: 'viendo',     label: 'Viendo' },
  { value: 'vista',      label: 'Vistas' },
  { value: 'abandonada', label: 'Abandonadas' },
];

const STATE_LABELS = {
  quiero_ver: '⏳ Quiero ver',
  viendo:     '▶️ Viendo',
  vista:      '✅ Vista',
  abandonada: '🚫 Abandonada',
};

const MiLista = () => {
  const {
    library,
    removeFromLibrary,
    markWatched,
    markPending,
    addToFavorites,
    removeFromFavorites,
    isInFavorites,
  } = useLibrary();

  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = library.filter((m) => {
    const matchState = filter === 'all' || m.state === filter;
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase());
    return matchState && matchSearch;
  });

  const watched  = library.filter((e) => e.state === 'vista').length;
  const pending  = library.filter((e) => e.state === 'quiero_ver').length;

  const handleFavToggle = async (m) => {
    try {
      if (isInFavorites(m.tmdb_id)) {
        await removeFromFavorites(m.tmdb_id);
      } else {
        await addToFavorites({ id: m.tmdb_id, title: m.title, poster_path: m.poster_path });
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Mi lista</h1>
          <p className="page-subtitle">
            {library.length} película{library.length !== 1 ? 's' : ''} · {watched} vistas · {pending} pendientes
          </p>
        </div>
      </div>

      {library.length === 0 ? (
        <div className="empty-hero">
          <div className="empty-icon">📋</div>
          <h3>Tu lista está vacía</h3>
          <p>Buscá películas y agregálas con el botón "Lista".</p>
        </div>
      ) : (
        <>
          {/* Controles */}
          <div className="list-controls">
            <div className="filter-tabs">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  className={`filter-tab ${filter === f.value ? 'active' : ''}`}
                  onClick={() => setFilter(f.value)}
                >
                  {f.label}
                  <span className="filter-count">
                    {f.value === 'all'
                      ? library.length
                      : library.filter((e) => e.state === f.value).length}
                  </span>
                </button>
              ))}
            </div>
            <input
              className="list-search"
              type="text"
              placeholder="Filtrar por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filtered.length === 0 && (
            <div className="empty-hero small">
              <div className="empty-icon">🤷</div>
              <h3>No hay resultados</h3>
              <p>Probá cambiando el filtro o la búsqueda.</p>
            </div>
          )}

          {/* Grid */}
          <div className="movie-grid">
            {filtered.map((m) => (
              <div className="movie-card" key={m.tmdb_id}>
                <div className="movie-poster-wrap">
                  <MoviePoster src={posterUrl(m.poster_path)} alt={m.title} />
                  <div className="movie-status-badge">
                    {STATE_LABELS[m.state] || m.state}
                  </div>
                </div>

                <div className="movie-info">
                  <h3 className="movie-title">{m.title}</h3>
                  {m.score && (
                    <p className="movie-meta">⭐ {m.score}/10</p>
                  )}
                  <p className="movie-added">
                    Agregada: {m.created_at ? m.created_at.slice(0, 10) : '—'}
                  </p>
                </div>

                <div className="movie-actions">
                  {m.state !== 'vista' ? (
                    <button
                      className="action-btn success"
                      onClick={() => markWatched(m.tmdb_id)}
                      title="Marcar como vista"
                    >
                      ✅ Ya la vi
                    </button>
                  ) : (
                    <button
                      className="action-btn secondary"
                      onClick={() => markPending(m.tmdb_id)}
                      title="Mover a quiero ver"
                    >
                      ↩ Quiero ver
                    </button>
                  )}

                  <button
                    className={`action-btn fav ${isInFavorites(m.tmdb_id) ? 'active' : ''}`}
                    onClick={() => handleFavToggle(m)}
                    title={isInFavorites(m.tmdb_id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  >
                    {isInFavorites(m.tmdb_id) ? '❤️' : '🤍'}
                  </button>

                  <button
                    className="action-btn danger"
                    onClick={() => removeFromLibrary(m.tmdb_id)}
                    title="Eliminar de la lista"
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

export default MiLista;
