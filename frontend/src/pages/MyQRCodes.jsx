// src/pages/MyQRCodes.jsx
import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import api from "../api/axiosClient";

function formatDate(dateString) {
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

export default function MyQRCodes() {
  const [qrs, setQrs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQrs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/qrs");
      setQrs(res.data || []);
    } catch (err) {
      console.error("Error obteniendo QRs:", err);
      Swal.fire({
        icon: "error",
        title: "Ups",
        text: "Error al cargar tus códigos QR.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQrs();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar QR?",
      text: "Esta acción no se puede deshacer.",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#ef4444",
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/qrs/${id}`);
      setQrs((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      console.error("Error eliminando QR:", err);
      Swal.fire({
        icon: "error",
        title: "Ups",
        text: "No se pudo eliminar el QR.",
      });
    }
  };

  const handleCopyContent = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      Swal.fire({
        icon: "success",
        title: "Contenido copiado",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "No se pudo copiar",
        text: "Copia manualmente el contenido.",
      });
    }
  };

  const handleDownload = (qr) => {
    const canvas = document.getElementById(`qr-canvas-${qr.id}`);
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    const safeTitle = (qr.title || "qr-code").trim() || "qr-code";
    link.href = dataUrl;
    link.download = `${safeTitle}.png`;
    link.click();
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-50">
          Mis QRs
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-xl">
          Aquí se muestran todos los códigos QR que has guardado en tu cuenta.
          Puedes copiarlos, descargarlos o eliminarlos.
        </p>
      </div>

      {loading ? (
        <div className="mt-4 text-sm text-slate-400">Cargando tus QRs...</div>
      ) : qrs.length === 0 ? (
        <div className="mt-4 text-sm text-slate-400">
          Aún no tienes códigos guardados. Crea uno desde{" "}
          <span className="font-semibold text-cyan-300">“Crear QR”.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {qrs.map((qr, idx) => (
            <motion.div
              key={qr.id}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.03 * idx, duration: 0.35 }}
              className="rounded-3xl border border-slate-800/80 bg-slate-950/80 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.7)] flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-50">
                    {qr.title}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {qr.project || "Sin proyecto"} ·{" "}
                    {qr.type === "URL" ? "URL" : "Texto"}
                  </p>
                </div>
                <span className="text-[10px] text-slate-500">
                  {formatDate(qr.created_at)}
                </span>
              </div>

              <div className="flex gap-3 items-center">
                <div className="flex-shrink-0">
                  <div className="aspect-square w-24 rounded-2xl bg-slate-900 flex items-center justify-center border border-slate-800">
                    <QRCodeCanvas
                      id={`qr-canvas-${qr.id}`}
                      value={qr.content}
                      size={2048}
                      fgColor={qr.color || "#000000"}
                      bgColor={qr.bgColor || "#ffffff"}
                      level="H"
                      includeMargin
                    />
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-2">
                  <div className="text-[11px] text-slate-300">
                    <span className="text-slate-400">Contenido: </span>
                    <span className="font-mono text-[10px] text-sky-300 break-all line-clamp-2">
                      {qr.content}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-1">
                    <button
                      onClick={() => handleCopyContent(qr.content)}
                      className="flex-1 min-w-[90px] text-[11px] px-3 py-1.5 rounded-full bg-slate-900 text-slate-100 border border-slate-700 hover:border-cyan-400 hover:text-cyan-200 transition-colors"
                    >
                      Copiar
                    </button>
                    <button
                      onClick={() => handleDownload(qr)}
                      className="flex-1 min-w-[90px] text-[11px] px-3 py-1.5 rounded-full bg-slate-900 text-slate-100 border border-slate-700 hover:border-sky-400 hover:text-sky-200 transition-colors"
                    >
                      Descargar
                    </button>
                    <button
                      onClick={() => handleDelete(qr.id)}
                      className="text-[11px] px-3 py-1.5 rounded-full bg-slate-900 text-red-300 border border-red-500/60 hover:bg-red-500/10 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
