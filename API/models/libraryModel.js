import pool from "../db/pool.js";

export const getLibraryByUser = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM library WHERE user_id = $1 ORDER BY updated_at DESC",
    [userId]
  );
  return result.rows;
};

export const addEntry = async (userId, { tmdb_id, title, poster_path, state }) => {
  const result = await pool.query(
    `INSERT INTO library (user_id, tmdb_id, title, poster_path, state)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (user_id, tmdb_id) DO NOTHING
     RETURNING *`,
    [userId, tmdb_id, title, poster_path, state || "quiero_ver"]
  );
  return result.rows[0];
};

export const updateEntry = async (userId, tmdbId, { state, is_favorite, score, review }) => {
  const result = await pool.query(
    `UPDATE library SET
     state        = COALESCE($1, state),
     is_favorite  = COALESCE($2, is_favorite),
     score        = COALESCE($3, score),
     review       = COALESCE($4, review),
     updated_at   = NOW()
     WHERE user_id = $5 AND tmdb_id = $6
     RETURNING *`,
    [state, is_favorite, score, review, userId, tmdbId]
  );
  return result.rows[0] || null;
};

export const deleteEntry = async (userId, tmdbId) => {
  const result = await pool.query(
    "DELETE FROM library WHERE user_id = $1 AND tmdb_id = $2 RETURNING *",
    [userId, tmdbId]
  );
  return result.rows[0] || null;
};
