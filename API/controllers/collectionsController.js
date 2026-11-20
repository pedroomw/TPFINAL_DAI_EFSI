import {
  getCollectionsByUser,
  createCollection,
  deleteCollection,
  addMovieToCollection,
  removeMovieFromCollection,
  findCollectionByIdAndUser,
} from "../models/collectionsModel.js";
import { logActivity } from "../models/activityModel.js";

// GET /api/collections
export const getCollections = async (req, res) => {
  try {
    const collections = await getCollectionsByUser(req.user.id);
    res.json(collections);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las colecciones" });
  }
};

// POST /api/collections
export const createCollectionHandler = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "El nombre de la colección es obligatorio" });
    }

    const collection = await createCollection(req.user.id, name, description);
    await logActivity(req.user.id, "coleccion_creada", null, name);
    res.status(201).json(collection);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la colección" });
  }
};

// DELETE /api/collections/:id
export const deleteCollectionHandler = async (req, res) => {
  try {
    const deleted = await deleteCollection(req.user.id, req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Colección no encontrada" });
    }
    await logActivity(req.user.id, "coleccion_eliminada", null, deleted.name);
    res.json({ message: "Colección eliminada" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la colección" });
  }
};

// POST /api/collections/:id/movies
export const addMovieToCollectionHandler = async (req, res) => {
  try {
    const { tmdb_id, title, poster_path } = req.body;

    if (!tmdb_id || !title) {
      return res.status(400).json({ error: "tmdb_id y title son obligatorios" });
    }

    const collection = await findCollectionByIdAndUser(req.params.id, req.user.id);
    if (!collection) {
      return res.status(404).json({ error: "Colección no encontrada" });
    }

    const movie = await addMovieToCollection(req.params.id, { tmdb_id, title, poster_path });
    await logActivity(req.user.id, "pelicula_agregada_coleccion", tmdb_id, title);
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar película a la colección" });
  }
};

// DELETE /api/collections/:id/movies/:movieId
export const removeMovieFromCollectionHandler = async (req, res) => {
  try {
    const collection = await findCollectionByIdAndUser(req.params.id, req.user.id);
    if (!collection) {
      return res.status(404).json({ error: "Colección no encontrada" });
    }

    await removeMovieFromCollection(req.params.id, req.params.movieId);
    await logActivity(req.user.id, "pelicula_quitada_coleccion", req.params.movieId, null);
    res.json({ message: "Película eliminada de la colección" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar película de la colección" });
  }
};
