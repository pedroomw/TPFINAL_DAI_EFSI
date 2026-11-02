import pool from "../db/pool.js";

export const getCollectionsByUser = async (userId) => {
  const result = await pool.query(
    `SELECT c.*,
      json_agg(cm.*) FILTER (WHERE cm.tmdb_id IS NOT NULL) AS movies
     FROM collections c
     LEFT JOIN collection_movies cm ON c.id = cm.collection_id
     WHERE c.user_id = $1
     GROUP BY c.id
     ORDER BY c.created_at DESC`,
    [userId]
  );
  return result.rows;
};

export const createCollection = async (userId, name, description) => {
  const result = await pool.query(
    `INSERT INTO collections (user_id, name, description)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, name, description || null]
  );
  return result.rows[0];
};

export const deleteCollection = async (userId, collectionId) => {
  const result = await pool.query(
    "DELETE FROM collections WHERE id = $1 AND user_id = $2 RETURNING *",
    [collectionId, userId]
  );
  return result.rows[0] || null;
};

export const addMovieToCollection = async (collectionId, { tmdb_id, title, poster_path }) => {
  const result = await pool.query(
    `INSERT INTO collection_movies (collection_id, tmdb_id, title, poster_path)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (collection_id, tmdb_id) DO NOTHING
     RETURNING *`,
    [collectionId, tmdb_id, title, poster_path]
  );
  return result.rows[0];
};

export const removeMovieFromCollection = async (collectionId, tmdbId) => {
  await pool.query(
    "DELETE FROM collection_movies WHERE collection_id = $1 AND tmdb_id = $2",
    [collectionId, tmdbId]
  );
};

export const findCollectionByIdAndUser = async (collectionId, userId) => {
  const result = await pool.query(
    "SELECT id FROM collections WHERE id = $1 AND user_id = $2",
    [collectionId, userId]
  );
  return result.rows[0] || null;
};
