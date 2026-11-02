//modulo con 4 funciones principales para navegar

import axios from "axios";
import "dotenv/config";

// Base de todas las llamadas a TMDB
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

// Cliente axios preconfigurado para TMDB
const tmdb = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: API_KEY,
    language: "es-AR",
  },
});

// 1. Buscar películas por texto
export const searchMovies = async (query, page = 1) => {
  const response = await tmdb.get("/search/movie", {
    params: { query, page },
  });
  return response.data;
};

// 2. Obtener detalle de una película por su ID de TMDB
export const getMovieById = async (movieId) => {
  const response = await tmdb.get(`/movie/${movieId}`);
  return response.data;
};

// 3. Obtener películas populares (para el Home)
export const getPopularMovies = async (page = 1) => {
  const response = await tmdb.get("/movie/popular", {
    params: { page },
  });
  return response.data;
};

// 4. Obtener géneros disponibles
export const getGenres = async () => {
  const response = await tmdb.get("/genre/movie/list");
  return response.data;
};
