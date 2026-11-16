export async function buscarPelícula(nombre) {
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=60ebdf77&s=${encodeURIComponent(nombre)}`
);


  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al buscar película');
  }

  return data;
}
