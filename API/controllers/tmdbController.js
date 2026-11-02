import { searchMovies, getMovieById, getPopularMovies, getGenres } from "../services/tmdbService.js";

// GET /api/movies/popular
export const popular = async (req, res) => {
  try {
    const { page } = req.query;
    const data = await getPopularMovies(page);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener películas populares" });
  }
};

// GET /api/movies/search?query=...&page=...
export const search = async (req, res) => {
  try {
    const { query, page } = req.query;
    if (!query) {
      return res.status(400).json({ error: "El parámetro query es obligatorio" });
    }
    const data = await searchMovies(query, page);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar películas" });
  }
};

// GET /api/movies/:id
export const detail = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getMovieById(id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el detalle de la película" });
  }
};

// GET /api/movies/genres
export const genres = async (req, res) => {
  try {
    const data = await getGenres();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener géneros" });
  }
};
