import { getStatsByUser } from "../models/statsModel.js";

// GET /api/stats
export const getStats = async (req, res) => {
  try {
    const stats = await getStatsByUser(req.user.id);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las estadísticas" });
  }
};
