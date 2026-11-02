export async function buscarPelícula(id) {
  const response = await fetch(`${process.env.MOVIE_BASE_URL}/?apikey=${process.env.MOVIE_API_KEY}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al buscar película');
  }

  return data;
}
