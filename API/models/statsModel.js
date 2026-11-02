import pool from "../db/pool.js";

export const getStatsByUser = async (userId) => {
  // 1. Conteo por estado
  const byState = await pool.query(
    `SELECT state, COUNT(*) AS total
     FROM library WHERE user_id = $1
     GROUP BY state`,
    [userId]
  );

  // 2. Puntuación promedio
  const avgScore = await pool.query(
    `SELECT ROUND(AVG(score), 1) AS average
     FROM library WHERE user_id = $1 AND score IS NOT NULL`,
    [userId]
  );

  // 3. Total de favoritos
  const favorites = await pool.query(
    `SELECT COUNT(*) AS total
     FROM library WHERE user_id = $1 AND is_favorite = true`,
    [userId]
  );

  // 4. Total de reseñas escritas
  const reviews = await pool.query(
    `SELECT COUNT(*) AS total
     FROM library WHERE user_id = $1 AND review IS NOT NULL AND review <> ''`,
    [userId]
  );

  // 5. Películas vistas este año
  const thisYear = await pool.query(
    `SELECT COUNT(*) AS total
     FROM library
     WHERE user_id = $1
       AND state = 'vista'
       AND EXTRACT(YEAR FROM updated_at) = EXTRACT(YEAR FROM NOW())`,
    [userId]
  );

  // 6. Total de colecciones
  const collections = await pool.query(
    `SELECT COUNT(*) AS total
     FROM collections WHERE user_id = $1`,
    [userId]
  );

  return {
    by_state:         byState.rows,
    average_score:    avgScore.rows[0].average || 0,
    total_favorites:  parseInt(favorites.rows[0].total),
    total_reviews:    parseInt(reviews.rows[0].total),
    watched_this_year: parseInt(thisYear.rows[0].total),
    total_collections: parseInt(collections.rows[0].total),
  };
};
