import { useState } from 'react';
import { useLibrary } from '../context/libraryContext';
import MoviePoster from './MoviePoster';

const FILTERS = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'watched', label: 'Vistas' },
];

const MiLista = () => {
  const { library, removeFromLibrary, markWatched, markPending, addToFavorites, isInFavorites } = useLibrary();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = library.filter((m) => {
    const matchStatus = filter === 'all' || m.status === filter;
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const watched = library.filter((e) => e.status === 'watched').length;
  const pending = library.filter((e) => e.status === 'pending').length;

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
                    {f.value === 'all' ? library.length : library.filter((e) => e.status === f.value).length}
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
              <div className="movie-card" key={m.imdbID}>
                <div className="movie-poster-wrap">
                  <MoviePoster src={m.poster} alt={m.title} />
                  <div className="movie-status-badge">
                    {m.status === 'watched' ? '✅ Vista' : '⏳ Pendiente'}
                  </div>
                </div>

                <div className="movie-info">
                  <h3 className="movie-title">{m.title}</h3>
                  <p className="movie-meta">{m.year} · {m.type}</p>
                  <p className="movie-added">Agregada: {m.addedAt}</p>
                </div>

                <div className="movie-actions">
                  {m.status === 'pending' ? (
                    <button
                      className="action-btn success"
                      onClick={() => markWatched(m.imdbID)}
                      title="Marcar como vista"
                    >
                      ✅ Marcar vista
                    </button>
                  ) : (
                    <button
                      className="action-btn secondary"
                      onClick={() => markPending(m.imdbID)}
                      title="Mover a pendientes"
                    >
                      ↩ Pendiente
                    </button>
                  )}
                  <button
                    className={`action-btn fav ${isInFavorites(m.imdbID) ? 'active' : ''}`}
                    onClick={() => addToFavorites(m)}
                    title="Agregar a favoritos"
                    disabled={isInFavorites(m.imdbID)}
                  >
                    {isInFavorites(m.imdbID) ? '❤️' : '🤍'}
                  </button>
                  <button
                    className="action-btn danger"
                    onClick={() => removeFromLibrary(m.imdbID)}
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
