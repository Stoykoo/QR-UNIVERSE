// backend/routes/qrs.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const authRequired = require("../middleware/auth");

/**
 * POST /api/qrs
 * body: { title, content, type, color, bgColor, project }
 */
router.post("/", authRequired, async (req, res) => {
  const userId = req.user.id;
  let { title, content, type, color, bgColor, project } = req.body || {};

  if (!title || !content) {
    return res
      .status(400)
      .json({ error: "Título y contenido son obligatorios." });
  }

  type = type === "TEXT" ? "TEXT" : "URL";
  color = color || "#000000";
  bgColor = bgColor || "#ffffff";

  try {
    const { rows } = await pool.query(
      `INSERT INTO qr_codes (user_id, title, content, type, color, bg_color, project)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING id, title, content, type, color, bg_color AS "bgColor", project, created_at`,
      [userId, title, content, type, color, bgColor, project || null]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error en POST /api/qrs:", err);
    res.status(500).json({ error: "Error al guardar el código QR." });
  }
});

/**
 * GET /api/qrs
 * Lista todos los QRs del usuario autenticado
 */
router.get("/", authRequired, async (req, res) => {
  const userId = req.user.id;

  try {
    const { rows } = await pool.query(
      `SELECT id, title, content, type, color, bg_color AS "bgColor",
              project, is_active AS "isActive", created_at
       FROM qr_codes
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error en GET /api/qrs:", err);
    res.status(500).json({ error: "Error al obtener tus códigos QR." });
  }
});

/**
 * GET /api/qrs/summary
 * Estadísticas para el dashboard del usuario logueado
 */
router.get("/summary", authRequired, async (req, res) => {
  const userId = req.user.id;

  try {
    // Total y últimos 7 días
    const countsResult = await pool.query(
      `
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (
          WHERE created_at >= NOW() - INTERVAL '7 days'
        ) AS last7days
      FROM qr_codes
      WHERE user_id = $1
      `,
      [userId]
    );

    const counts = countsResult.rows[0] || { total: 0, last7days: 0 };

    // Proyectos activos (distintos con nombre)
    const projectsResult = await pool.query(
      `
      SELECT COUNT(DISTINCT project) AS projects
      FROM qr_codes
      WHERE user_id = $1
        AND project IS NOT NULL
        AND TRIM(project) <> ''
      `,
      [userId]
    );

    const projects =
      projectsResult.rows[0]?.projects != null
        ? Number(projectsResult.rows[0].projects)
        : 0;

    res.json({
      total: Number(counts.total || 0),
      last7days: Number(counts.last7days || 0),
      projects,
    });
  } catch (err) {
    console.error("Error en GET /api/qrs/summary:", err);
    res.status(500).json({ error: "Error al obtener el resumen de QRs." });
  }
});

/**
 * GET /api/qrs/recent?limit=4
 * Últimos N QRs del usuario
 */
router.get("/recent", authRequired, async (req, res) => {
  const userId = req.user.id;
  let limit = parseInt(req.query.limit, 10);
  if (Number.isNaN(limit) || limit <= 0) limit = 4;
  if (limit > 20) limit = 20;

  try {
    const { rows } = await pool.query(
      `
      SELECT id, title, content, type, color, bg_color AS "bgColor",
             project, is_active AS "isActive", created_at
      FROM qr_codes
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2
      `,
      [userId, limit]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error en GET /api/qrs/recent:", err);
    res.status(500).json({ error: "Error al obtener códigos recientes." });
  }
});

/**
 * DELETE /api/qrs/:id
 * Elimina un QR del usuario
 */
router.delete("/:id", authRequired, async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const { rowCount } = await pool.query(
      `DELETE FROM qr_codes
       WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (rowCount === 0) {
      return res
        .status(404)
        .json({ error: "No se encontró el QR o no te pertenece." });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("Error en DELETE /api/qrs/:id:", err);
    res.status(500).json({ error: "Error al eliminar el código QR." });
  }
});

module.exports = router;
