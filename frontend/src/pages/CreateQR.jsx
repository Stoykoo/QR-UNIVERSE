// src/pages/CreateQR.jsx
import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";
import api from "../api/axiosClient";
import { darkSwal, showQrSavedAlert, showErrorAlert } from "../utils/swalTheme";

export default function CreateQR() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("URL");
  const [project, setProject] = useState("");
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [saving, setSaving] = useState(false);

  const qrCanvasRef = useRef(null); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      await darkSwal.fire({
        icon: "warning",
        iconColor: "#facc15",
        title: "Datos incompletos",
        html: "Agrega al menos un título y contenido para el QR.",
      });
      return;
    }

    setSaving(true);
    try {
      await api.post("/qrs", {
        title: title.trim(),
        content: content.trim(),
        type,
        color,
        bgColor,
        project: project.trim() || null,
      });

      await showQrSavedAlert();

      setTitle("");
      setContent("");
      setProject("");
    } catch (err) {
      console.error("Error guardando QR:", err);
      const msg =
        err?.response?.data?.error ||
        "Ocurrió un error al guardar el código QR.";
      showErrorAlert("Ups", msg);
    } finally {
      setSaving(false);
    }
  };

  const hasContent = !!content.trim();

    const handleDownloadPNG = () => {
      if (!hasContent) return;

      const canvas = document.getElementById("qr-hd-download");
      if (!canvas) return;

      const dataUrl = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      const safeTitle = title.trim() || "qr-code";
      link.href = dataUrl;
      link.download = `${safeTitle}.png`;
      link.click();
    };



  return (
    <div className="h-full flex flex-col gap-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-50">
          Crear QR
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-xl">
          Configura el contenido, los colores y un nombre identificador. El
          código se guardará en tu cuenta para consultarlo después.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr),minmax(0,0.9fr)] gap-5">
        {/* Formulario */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-slate-800/80 bg-slate-950/80 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.7)] space-y-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="text-left">
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Título del QR
              </label>
              <input
                type="text"
                className="w-full rounded-full px-4 py-2.5 text-sm bg-slate-900/70 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-slate-100 placeholder:text-slate-500"
                placeholder="Ej. Landing proyecto ITT"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="text-left">
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Proyecto / carpeta (opcional)
              </label>
              <input
                type="text"
                className="w-full rounded-full px-4 py-2.5 text-sm bg-slate-900/70 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-slate-100 placeholder:text-slate-500"
                placeholder="Residencia ITT, Campaña biblioteca..."
                value={project}
                onChange={(e) => setProject(e.target.value)}
              />
            </div>
          </div>

          <div className="text-left">
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Contenido del QR
            </label>
            <textarea
              className="w-full rounded-2xl px-4 py-2.5 text-sm bg-slate-900/70 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-slate-100 placeholder:text-slate-500 resize-none h-28"
              placeholder="URL (https://...) o cualquier texto que quieras codificar."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
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

            <div className="text-left">
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Color del QR
              </label>
              <input
                type="color"
                className="w-full h-10 rounded-2xl border border-slate-700 bg-slate-900 cursor-pointer"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>

            <div className="text-left">
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Color de fondo
              </label>
              <input
                type="color"
                className="w-full h-10 rounded-2xl border border-slate-700 bg-slate-900 cursor-pointer"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-cyan-500 text-slate-950 text-sm font-semibold shadow-lg shadow-cyan-500/40 hover:bg-cyan-400 transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving && (
                <span className="w-4 h-4 border-2 border-slate-900/50 border-t-transparent rounded-full animate-spin" />
              )}
              <span>{saving ? "Guardando..." : "Guardar QR"}</span>
            </button>
          </div>
        </motion.form>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="rounded-3xl border border-slate-800/80 bg-slate-950/80 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.7)] flex flex-col gap-4"
        >
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Vista previa
              </p>
              <p className="text-sm font-semibold text-slate-50">
                {title || "Nuevo código QR"}
              </p>
            </div>
            <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/40">
              {hasContent ? "Listo para guardar" : "Esperando contenido"}
            </span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            {/* PREVIEW NORMAL */}
            <div className="aspect-square max-w-[220px] w-full rounded-2xl bg-slate-900 flex items-center justify-center border border-slate-800">
              {hasContent ? (
                <>
                  <QRCodeCanvas
                    value={content}
                    size={160}
                    fgColor={color}
                    bgColor={bgColor}
                    level="H"
                    includeMargin
                    ref={qrCanvasRef}
                  />

                  {/* QR HD OCULTO PARA DESCARGA */}
                  <div style={{ position: "absolute", left: "-9999px" }}>
                    <QRCodeCanvas
                      id="qr-hd-download"
                      value={content}
                      size={800}  
                      fgColor={color}
                      bgColor={bgColor}
                      level="H"
                      includeMargin
                    />
                  </div>
                </>
              ) : (
                <p className="text-xs text-slate-500 max-w-[160px] text-center">
                  Escribe contenido en el formulario para generar tu QR.
                </p>
              )}
            </div>


            <button
              type="button"
              onClick={handleDownloadPNG}
              disabled={!hasContent}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-slate-900 text-slate-100 border border-slate-700 hover:border-cyan-400 hover:text-cyan-200 transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Descargar PNG
            </button>

            <div className="w-full space-y-1 text-[11px] text-slate-300">
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-400">Tipo</span>
                <span className="font-medium text-slate-50">
                  {type === "URL" ? "Enlace / URL" : "Texto libre"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-400">Proyecto</span>
                <span className="text-slate-100 truncate max-w-[180px]">
                  {project || "Sin proyecto asignado"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-400">Contenido</span>
                <span className="font-mono text-[10px] text-sky-300 truncate max-w-[180px]">
                  {content || "—"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
