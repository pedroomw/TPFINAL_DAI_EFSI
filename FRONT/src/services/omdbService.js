const OMDB_KEY = import.meta.env.VITE_OMDB_KEY || '60ebdf77';
const BASE = 'https://www.omdbapi.com';

export async function searchMovies(query) {
  const res = await fetch(`${BASE}/?apikey=${OMDB_KEY}&s=${encodeURIComponent(query)}`);
  const data = await res.json();
  if (data.Response === 'False') throw new Error(data.Error || 'Sin resultados');
  return data.Search ?? [];
}

export async function getMovieDetails(imdbID) {
  const res = await fetch(`${BASE}/?apikey=${OMDB_KEY}&i=${imdbID}&plot=short`);
  const data = await res.json();
  if (data.Response === 'False') throw new Error(data.Error || 'No encontrado');
  return data;
}
