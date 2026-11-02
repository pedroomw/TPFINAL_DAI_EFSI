import { getLibraryByUser, addEntry, updateEntry, deleteEntry } from "../models/libraryModel.js";

const VALID_STATES = ["quiero_ver", "viendo", "vista", "abandonada"];

// GET /api/library
export const getLibrary = async (req, res) => {
  try {
    const library = await getLibraryByUser(req.user.id);
    res.json(library);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la biblioteca" });
  }
};

// POST /api/library
export const addToLibrary = async (req, res) => {
  try {
    const { tmdb_id, title, poster_path, state } = req.body;

    if (!tmdb_id || !title) {
      return res.status(400).json({ error: "tmdb_id y title son obligatorios" });
    }
    if (state && !VALID_STATES.includes(state)) {
      return res.status(400).json({ error: `Estado inválido. Los válidos son: ${VALID_STATES.join(", ")}` });
    }

    const entry = await addEntry(req.user.id, { tmdb_id, title, poster_path, state });
    if (!entry) {
      return res.status(409).json({ error: "La película ya está en tu biblioteca" });
    }
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar a la biblioteca" });
  }
};

// PUT /api/library/:movieId
export const updateLibraryEntry = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { state, is_favorite, score, review } = req.body;

    if (state && !VALID_STATES.includes(state)) {
      return res.status(400).json({ error: `Estado inválido. Los válidos son: ${VALID_STATES.join(", ")}` });
    }
    if (score !== undefined && (score < 1 || score > 10)) {
      return res.status(400).json({ error: "La puntuación debe ser entre 1 y 10" });
    }

    const entry = await updateEntry(req.user.id, movieId, { state, is_favorite, score, review });
    if (!entry) {
      return res.status(404).json({ error: "Película no encontrada en tu biblioteca" });
    }
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la biblioteca" });
  }
};

// DELETE /api/library/:movieId
export const removeFromLibrary = async (req, res) => {
  try {
    const { movieId } = req.params;

    const entry = await deleteEntry(req.user.id, movieId);
    if (!entry) {
      return res.status(404).json({ error: "Película no encontrada en tu biblioteca" });
    }
    res.json({ message: "Película eliminada de la biblioteca" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar de la biblioteca" });
  }
};
