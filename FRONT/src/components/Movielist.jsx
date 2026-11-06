const Movielist = ({ peliculas }) => {
  const movies = peliculas?.Search ?? [];

  if (!peliculas) {
    return (
      <div className="empty-state">
        <h3>Busca una película para empezar</h3>
      </div>
    );
  }

  if (!movies.length) {
    return (
      <div className="empty-state">
        <h3>No se encontraron resultados</h3>
        <p>Probá con otro nombre o una búsqueda más exacta.</p>
      </div>
    );
  }

  return (
    <section className="movie-grid">
      {movies.map((pelicula, index) => (
        <article className="movie-card" key={pelicula.imdbID || index}>
          {pelicula.Poster && pelicula.Poster !== 'N/A' ? (
            <img className="movie-poster" src={pelicula.Poster} alt={pelicula.Title} />
          ) : (
            <div className="movie-poster" style={{ display: 'grid', placeItems: 'center', color: '#a9b5d1', fontWeight: 700 }}>
              Sin imagen
            </div>
          )}

          <div className="movie-info">
            <h2 className="movie-title">{pelicula.Title}</h2>
            <p className="movie-meta">{pelicula.Year} • {pelicula.Type}</p>
          </div>
        </article>
      ))}
    </section>
  );
};

export default Movielist;