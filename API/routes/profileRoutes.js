import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getProfile, updateProfile } from "../controllers/profileController.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getProfile);      // GET /api/profile
router.put("/", updateProfile);   // PUT /api/profile

export default router;
