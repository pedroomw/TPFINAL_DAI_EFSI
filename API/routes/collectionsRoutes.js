import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getCollections,
  createCollectionHandler,
  deleteCollectionHandler,
  addMovieToCollectionHandler,
  removeMovieFromCollectionHandler,
} from "../controllers/collectionsController.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getCollections);
router.post("/", createCollectionHandler);
router.delete("/:id", deleteCollectionHandler);
router.post("/:id/movies", addMovieToCollectionHandler);
router.delete("/:id/movies/:movieId", removeMovieFromCollectionHandler);

export default router;
