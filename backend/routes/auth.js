// backend/routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const authRequired = require("../middleware/auth");

const router = express.Router();

const SALT_ROUNDS = 10;

/* ========== Helpers ========== */

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function sendAuthResponse(res, user) {
  const token = createToken(user);

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",     // en prod con HTTPS: "none"
    secure: false,       // en prod con HTTPS: true
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
  });

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
}

/* ========== POST /api/auth/register ========== */
/**
 * body: { name, email, password }
 */
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    // ¿Ya existe ese email?
    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Ese correo ya está registrado" });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const insert = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [name, email, passwordHash]
    );

    const user = insert.rows[0];
    sendAuthResponse(res, user);
  } catch (err) {
    console.error("Error en /api/auth/register:", err);
    res.status(500).json({ error: "Error registrando usuario" });
  }
});

/* ========== POST /api/auth/login ========== */
/**
 * body: { email, password }
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Correo y contraseña son obligatorios" });
  }

  try {
    const result = await pool.query(
      "SELECT id, name, email, password_hash FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos" });
    }

    const user = result.rows[0];

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos" });
    }

    sendAuthResponse(res, user);
  } catch (err) {
    console.error("Error en /api/auth/login:", err);
    res.status(500).json({ error: "Error iniciando sesión" });
  }
});

/* ========== POST /api/auth/logout ========== */

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ ok: true, message: "Sesión cerrada" });
});

/* ========== GET /api/auth/me ========== */
/**
 * Devuelve el usuario actual usando el token
 */
router.get("/me", authRequired, async (req, res) => {
  try {
    const { id } = req.user;

    const result = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error("Error en /api/auth/me:", err);
    res.status(500).json({ error: "Error obteniendo usuario" });
  }
});

/* ========== (Opcional) POST /api/auth/forgot-password ========== */
/**
 * Aquí más adelante podemos implementar envío de correo,
 * token de recuperación, etc. Por ahora solo responde 501.
 */
router.post("/forgot-password", (req, res) => {
  return res.status(501).json({
    error:
      "Función de recuperación de contraseña aún no implementada en el backend.",
  });
});

module.exports = router;
