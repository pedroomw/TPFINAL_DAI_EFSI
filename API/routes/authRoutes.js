import { Router } from "express";
import { register, login, me } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);            // pública
router.post("/login", login);                  // pública
router.get("/me", authMiddleware, me);         // protegida: requiere JWT válido

export default router;
