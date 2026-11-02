import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getLibrary, addToLibrary, updateLibraryEntry, removeFromLibrary } from "../controllers/libraryController.js";

const router = Router();

// Todas las rutas de biblioteca requieren estar logueado
router.use(authMiddleware);

router.get("/", getLibrary);                    // GET    /api/library
router.post("/", addToLibrary);                 // POST   /api/library
router.put("/:movieId", updateLibraryEntry);    // PUT    /api/library/:movieId
router.delete("/:movieId", removeFromLibrary);  // DELETE /api/library/:movieId

export default router;
