/**
 * Búsqueda de películas usando OMDB (ya tiene key hardcodeada).
 * Devuelve objetos normalizados con la misma forma que usa el resto del front:
 *   { id, title, release_date, poster_path, overview }
 *
 * id = imdbID (string tipo "tt0111161") — se usa como tmdb_id en la DB
 */

const OMDB_KEY = import.meta.env.VITE_OMDB_KEY || '60ebdf77';
const OMDB_BASE = 'https://www.omdbapi.com';

export const POSTER_BASE = '';

export async function searchMovies(query) {
  const res = await fetch(
    `${OMDB_BASE}/?apikey=${OMDB_KEY}&s=${encodeURIComponent(query)}&type=movie`
  );
  const data = await res.json();
  if (data.Response === 'False') throw new Error(data.Error || 'Sin resultados');

  // Normalizar al formato que usa el front
  return (data.Search ?? []).map(normalizeOMDB);
}

export async function getPopularMovies() {
  // OMDB no tiene endpoint de populares — devolvemos una lista curada
  const titles = ['Inception', 'Interstellar', 'The Dark Knight', 'Pulp Fiction', 'The Godfather', 'Fight Club', 'Forrest Gump', 'The Matrix'];
  const results = await Promise.allSettled(
    titles.map((t) =>
      fetch(`${OMDB_BASE}/?apikey=${OMDB_KEY}&t=${encodeURIComponent(t)}&type=movie`)
        .then((r) => r.json())
        .then((d) => (d.Response === 'True' ? normalizeOMDB(d) : null))
    )
  );
  return results
    .filter((r) => r.status === 'fulfilled' && r.value)
    .map((r) => r.value);
}

export function posterUrl(posterPath) {
  // posterPath ya es la URL completa que viene de OMDB
  if (!posterPath || posterPath === 'N/A') return null;
  return posterPath;
}

function normalizeOMDB(m) {
  return {
    id: m.imdbID ?? m.i,                          // identificador único
    title: m.Title ?? m.title,
    release_date: m.Year ? `${m.Year}-01-01` : null,
    poster_path: m.Poster && m.Poster !== 'N/A' ? m.Poster : null,
    overview: m.Plot ?? '',
  };
}
