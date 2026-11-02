import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import libraryRoutes from "./routes/libraryRoutes.js";
import collectionsRoutes from "./routes/collectionsRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());           // permite solicitudes desde el frontend
app.use(express.json());   // parsea el body de las requests como JSON

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/collections", collectionsRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/stats", statsRoutes);

// Ruta de prueba para verificar que el servidor funciona
app.get("/", (req, res) => {
  res.json({ message: "API funcionando" });
});

// Middleware de errores global — captura cualquier error no manejado
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Error interno del servidor",
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
