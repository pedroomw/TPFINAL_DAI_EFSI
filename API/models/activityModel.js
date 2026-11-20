import pool from "../db/pool.js";

/**
 * Registra una acción del usuario en la tabla activity.
 * No lanza errores para no interrumpir el flujo principal.
 */
export const logActivity = async (userId, action, tmdbId = null, title = null) => {
  try {
    await pool.query(
      `INSERT INTO activity (user_id, action, tmdb_id, title)
       VALUES ($1, $2, $3, $4)`,
      [userId, action, tmdbId, title]
    );
  } catch (err) {
    console.error("Error registrando actividad:", err.message);
  }
};

/**
 * Devuelve las últimas N acciones de un usuario.
 */
export const getRecentActivity = async (userId, limit = 20) => {
  const result = await pool.query(
    `SELECT * FROM activity
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [userId, limit]
  );
  return result.rows;
};
