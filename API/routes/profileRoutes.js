import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import { getRecentActivity } from "../models/activityModel.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getProfile);            // GET /api/profile
router.put("/", updateProfile);         // PUT /api/profile

// GET /api/profile/activity — últimas acciones del usuario
router.get("/activity", async (req, res) => {
  try {
    const activity = await getRecentActivity(req.user.id);
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener actividad" });
  }
});

export default router;
