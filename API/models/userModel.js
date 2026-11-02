import pool from "../db/pool.js";

export const findUserByEmail = async (email) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0] || null;
};

export const findUserById = async (id) => {
  const result = await pool.query(
    "SELECT id, username, email, avatar, bio, created_at FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
};

export const createUser = async (username, email, hashedPassword) => {
  const result = await pool.query(
    `INSERT INTO users (username, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, username, email`,
    [username, email, hashedPassword]
  );
  return result.rows[0];
};

export const updateUser = async (id, { username, bio, avatar }) => {
  const result = await pool.query(
    `UPDATE users SET
     username   = COALESCE($1, username),
     bio        = COALESCE($2, bio),
     avatar     = COALESCE($3, avatar),
     updated_at = NOW()
     WHERE id = $4
     RETURNING id, username, email, avatar, bio`,
    [username, bio, avatar, id]
  );
  return result.rows[0];
};
