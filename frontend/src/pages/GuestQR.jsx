// src/pages/GuestQR.jsx
import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";
import AuthCard from "../components/AuthCard";

export default function GuestQR() {
  const [content, setContent] = useState("");
  const [type, setType] = useState("URL");
  const [title, setTitle] = useState("");
  const qrCanvasRef = useRef(null);

  const hasContent = !!content.trim();

  const handleDownloadPNG = () => {
    const canvas = qrCanvasRef.current;
    if (!canvas || !hasContent) return;

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    const safeTitle = title.trim() || "qr-invitado";
    link.href = dataUrl;
    link.download = `${safeTitle}.png`;
    link.click();
  };

  return (
    <AuthCard
      title="Modo invitado"
      subtitle="Genera un código QR rápido. No se guardará en tu cuenta, pero puedes descargar la imagen."
      showBackHome
    >
      <div className="grid grid-cols-1 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="space-y-3"
        >
          <div className="text-left">
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Título (opcional)
            </label>
            <input
              type="text"
              className="w-full rounded-full px-4 py-2.5 text-sm bg-slate-900/70 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-slate-100 placeholder:text-slate-500"
              placeholder="Ej. QR rápido"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="text-left">
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Contenido del QR
            </label>
            <textarea
              className="w-full rounded-2xl px-4 py-2.5 text-sm bg-slate-900/70 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-slate-100 placeholder:text-slate-500 resize-none h-24"
              placeholder="URL o texto..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="text-left">
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Tipo
            </label>
            <select
              className="w-full rounded-full px-4 py-2.5 text-sm bg-slate-900/70 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-slate-100"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="URL">URL</option>
              <option value="TEXT">Texto</option>
            </select>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-4 flex flex-col items-center gap-3"
        >
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Vista previa
          </p>
          <div className="aspect-square max-w-[180px] w-full rounded-2xl bg-slate-900 flex items-center justify-center border border-slate-800">
            {hasContent ? (
              <QRCodeCanvas
                ref={qrCanvasRef}
                value={content}
                size={2048}
                fgColor="#ffffff"
                bgColor="#020617"
                level="H"
                includeMargin
              />
            ) : (
              <p className="text-xs text-slate-500 text-center px-4">
                Escribe contenido para generar tu código QR.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleDownloadPNG}
            disabled={!hasContent}
            className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-cyan-500 text-slate-950 text-xs font-semibold shadow-lg shadow-cyan-500/40 hover:bg-cyan-400 transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Descargar PNG
          </button>
        </motion.div>
      </div>
    </AuthCard>
  );
}
