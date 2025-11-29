// backend/server.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const pool = require("./db");

const authRoutes = require("./routes/auth");
const qrRoutes = require("./routes/qrs");

const app = express();

/* =======================================================
   🔥 CORS CONFIG AUTOMÁTICO PARA LOCALHOST + PRODUCCIÓN
   ======================================================= */

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:5173"]; // fallback

console.log("🌐 ORÍGENES PERMITIDOS POR CORS:", allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      // Si la petición NO tiene origin (Postman/server), permitir
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ CORS BLOQUEÓ:", origin);
      return callback(new Error("Origin no permitido por CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

/* =======================================================
   🔥 Health Check
   ======================================================= */
app.get("/api/health", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT NOW()");
    res.json({
      ok: true,
      message: "Backend listo y funcionando 💜",
      time: rows[0].now,
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Error consultando DB" });
  }
});

/* =======================================================
   🔥 RUTAS PRINCIPALES
   ======================================================= */
app.use("/api/auth", authRoutes);
app.use("/api/qrs", qrRoutes);

/* =======================================================
   🔥 LISTEN EN 0.0.0.0 (PRODUCCIÓN + LOCALHOST)
   ======================================================= */

const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 API escuchando en http://0.0.0.0:${PORT}`);
  console.log(`💡 En localhost → http://localhost:${PORT}`);
});
