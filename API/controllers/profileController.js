import { findUserById, updateUser } from "../models/userModel.js";

// GET /api/profile
export const getProfile = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el perfil" });
  }
};

// PUT /api/profile
export const updateProfile = async (req, res) => {
  try {
    const { username, bio, avatar } = req.body;

    if (!username && !bio && !avatar) {
      return res.status(400).json({ error: "Enviá al menos un campo para actualizar" });
    }

    const user = await updateUser(req.user.id, { username, bio, avatar });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el perfil" });
  }
};
