// src/pages/DashboardHome.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axiosClient";
import { QRCodeCanvas } from "qrcode.react";

function formatDate(dateString) {
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

export default function DashboardHome() {
  const [summary, setSummary] = useState({
    total: 0,
    last7days: 0,
    projects: 0,
  });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [summaryRes, recentRes] = await Promise.all([
          api.get("/qrs/summary"),
          api.get("/qrs/recent?limit=4"),
        ]);

        setSummary(summaryRes.data || { total: 0, last7days: 0, projects: 0 });
        setRecent(recentRes.data || []);
      } catch (err) {
        console.error("Error cargando dashboard:", err);
        setSummary({ total: 0, last7days: 0, projects: 0 });
        setRecent([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const latest = recent[0] || null;
  const activity = recent.slice(0, 3);

  const cards = [
    {
      label: "QRs totales",
      value: summary.total,
      hint: "Guardados en tu cuenta",
      accent: "from-cyan-500/70 to-sky-500/70",
    },
    {
      label: "Últimos 7 días",
      value: summary.last7days,
      hint: "QRs generados esta semana",
      accent: "from-emerald-500/70 to-cyan-500/70",
    },
    {
      label: "Proyectos activos",
      value: summary.projects,
      hint: "Carpetas o campañas",
      accent: "from-indigo-500/70 to-cyan-500/70",
    },
  ];

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Título y descripción */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-50">
          Resumen
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-xl">
          Aquí verás un vistazo rápido de tu actividad con códigos QR: cuántos
          has creado, los más recientes y tus proyectos activos.
        </p>
      </div>

      {/* Tarjetas de stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.05 * idx, duration: 0.4 }}
            className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/70 px-4 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.65)]"
          >
            <div
              className={`pointer-events-none absolute inset-x-0 -top-20 h-32 bg-gradient-to-br ${card.accent} opacity-25 blur-3xl`}
            />
            <div className="relative flex flex-col gap-1">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                {card.label}
              </p>
              <p className="text-3xl font-extrabold text-slate-50">
                {loading ? "…" : card.value}
              </p>
              <p className="text-xs text-slate-400">{card.hint}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Zona inferior: quick view + actividad reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr),minmax(0,1fr)] gap-4 mt-2">
        {/* Último código generado */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Vista rápida
              </p>
              <p className="text-sm font-semibold text-slate-50">
                Último código generado
              </p>
            </div>
            {latest && (
              <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/40">
                Guardado
              </span>
            )}
          </div>

          {loading ? (
            <p className="text-sm text-slate-400">Cargando información...</p>
          ) : !latest ? (
            <p className="text-sm text-slate-400">
              Aún no has creado ningún código QR. Empieza en{" "}
              <span className="font-semibold text-cyan-300">“Crear QR”.</span>
            </p>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1 flex justify-center">
                <div className="aspect-square max-w-[170px] w-full rounded-3xl bg-gradient-to-br from-slate-800/60 to-slate-900/90 flex items-center justify-center border border-slate-700/80">
                    <div className="rounded-2xl bg-slate-950 p-3 border border-slate-800">
                    <QRCodeCanvas
                        value={latest.content}
                        size={120}
                        fgColor={latest.color || "#000000"}
                        bgColor={latest.bgColor || "#ffffff"}
                        level="H"
                        includeMargin
                    />
                    </div>
                </div>
                </div>

              <div className="flex-1 space-y-2 text-[11px] text-slate-300 w-full">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-400">Título</span>
                  <span className="font-medium text-slate-50 truncate max-w-[160px]">
                    {latest.title}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-400">Tipo</span>
                  <span className="text-slate-100">
                    {latest.type === "URL" ? "Enlace / URL" : "Texto"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-400">Destino</span>
                  <span className="font-mono text-[10px] text-sky-300 truncate max-w-[170px]">
                    {latest.content}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-400">Creado</span>
                  <span className="text-slate-100">
                    {formatDate(latest.created_at)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Actividad reciente */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="rounded-3xl border border-slate-800/80 bg-slate-950/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
        >
          <p className="text-sm font-semibold mb-3 text-slate-50">
            Actividad reciente
          </p>

          {loading ? (
            <p className="text-sm text-slate-400">Cargando actividad...</p>
          ) : activity.length === 0 ? (
            <p className="text-sm text-slate-400">
              Aquí aparecerán tus últimos códigos QR generados.
            </p>
          ) : (
            <ul className="space-y-2 text-[12px] text-slate-300">
              {activity.map((qr) => (
                <li
                  key={qr.id}
                  className="flex items-start justify-between gap-3"
                >
                  <div>
                    <p className="font-medium text-slate-100">
                      {qr.title || "Sin título"}
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      {qr.project || "Uso general"} ·{" "}
                      {qr.type === "URL" ? "URL" : "Texto"}
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {formatDate(qr.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </div>
  );
}
