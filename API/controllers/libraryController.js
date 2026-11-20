import { getLibraryByUser, addEntry, updateEntry, deleteEntry } from "../models/libraryModel.js";
import { logActivity } from "../models/activityModel.js";

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

    await logActivity(req.user.id, "pelicula_agregada", tmdb_id, title);

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
    if (score !== undefined && score !== null && (score < 1 || score > 10)) {
      return res.status(400).json({ error: "La puntuación debe ser entre 1 y 10" });
    }

    const entry = await updateEntry(req.user.id, movieId, { state, is_favorite, score, review });
    if (!entry) {
      return res.status(404).json({ error: "Película no encontrada en tu biblioteca" });
    }

    // Registrar actividad según qué cambió
    if (state) {
      await logActivity(req.user.id, "estado_modificado", entry.tmdb_id, entry.title);
    }
    if (is_favorite === true) {
      await logActivity(req.user.id, "favorito_agregado", entry.tmdb_id, entry.title);
    }
    if (is_favorite === false) {
      await logActivity(req.user.id, "favorito_quitado", entry.tmdb_id, entry.title);
    }
    if (score !== undefined && score !== null) {
      await logActivity(req.user.id, "puntuacion_agregada", entry.tmdb_id, entry.title);
    }
    if (review !== undefined && review !== null && review !== "") {
      const isNew = !entry.review;
      await logActivity(
        req.user.id,
        isNew ? "resena_agregada" : "resena_modificada",
        entry.tmdb_id,
        entry.title
      );
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
