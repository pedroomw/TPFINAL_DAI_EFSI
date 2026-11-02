import { Router } from "express";
import { popular, search, detail, genres } from "../controllers/tmdbController.js";

const router = Router();

router.get("/popular", popular);       // GET /api/movies/popular
router.get("/search", search);         // GET /api/movies/search?query=...
router.get("/genres", genres);         // GET /api/movies/genres
router.get("/:id", detail);            // GET /api/movies/:id  (va al final para no pisar las rutas anteriores)

export default router;
