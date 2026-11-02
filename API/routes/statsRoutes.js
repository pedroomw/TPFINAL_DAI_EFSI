import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getStats } from "../controllers/statsController.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getStats); // GET /api/stats

export default router;
