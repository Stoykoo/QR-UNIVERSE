// backend/server.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const pool = require("./db");

const authRoutes = require("./routes/auth");
const qrRoutes = require("./routes/qrs");

const app = express();

// === LEER ORÍGENES PERMITIDOS DEL .env ===
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:5173"];

console.log("🌐 CORS ORIGINS PERMITIDOS:", allowedOrigins);

// === CONFIG CORRECTO DE CORS ===
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log("❌ Origin bloqueado por CORS:", origin);
        return callback(new Error("No permitido por CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// === Ruta de prueba ===
app.get("/api/health", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT NOW()");
    res.json({
      ok: true,
      message: "Backend listo y funcionando 💜",
      dbTime: rows[0].now,
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Error consultando DB" });
  }
});

// === Rutas principales ===
app.use("/api/auth", authRoutes);
app.use("/api/qrs", qrRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 API escuchando en http://localhost:${PORT}`);
});
