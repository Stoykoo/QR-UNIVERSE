// backend/middleware/auth.js
const jwt = require("jsonwebtoken");

function authRequired(req, res, next) {
  const cookieToken = req.cookies?.token; // token en cookie
  const headerAuth = req.headers.authorization; // Authorization: Bearer xxx
  const headerToken = headerAuth?.startsWith("Bearer ")
    ? headerAuth.split(" ")[1]
    : null;

  const token = cookieToken || headerToken;

  if (!token) {
    return res.status(401).json({ error: "No autenticado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, name }
    next();
  } catch (err) {
    console.error("Error verificando token:", err.message);
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

module.exports = authRequired;
