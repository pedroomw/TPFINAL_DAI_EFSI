import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // El token viene en el header Authorization: Bearer <token>
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verifica el token y extrae el payload (en nuestro caso: { id })
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Pone el usuario en req.user para que lo usen los controllers
    req.user = decoded;

    next(); // todo ok, seguir al controller
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

export default authMiddleware;
