// src/components/AuthCard.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function AuthCard({
  title,
  subtitle,
  children,
  showBackHome,
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden">
      {/* Glows de fondo (mismo estilo que landing) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-32 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-20 h-80 w-80 rounded-full bg-indigo-500/25 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_transparent_60%)]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10 flex flex-col gap-10">
        {/* Top bar igual que landing */}
        <header className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center text-xs font-bold shadow-lg shadow-cyan-500/40">
              QR
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight">
                QR Universe
              </div>
              <div className="text-[11px] text-slate-400">
                Generador y gestor de códigos QR
              </div>
            </div>
          </Link>

          {showBackHome && (
            <Link
              to="/"
              className="text-xs font-medium px-3 py-1.5 rounded-full border border-slate-700/80 hover:border-cyan-400/80 hover:text-cyan-300 transition-colors bg-slate-900/70"
            >
              Volver al inicio
            </Link>
          )}
        </header>

        {/* Card central */}
        <main className="flex-1 flex items-center justify-center pb-6 md:pb-10">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="w-full max-w-md bg-slate-950/90 border border-slate-800/80 rounded-3xl px-7 py-7 shadow-[0_20px_70px_rgba(0,0,0,0.75)] backdrop-blur-xl"
          >
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-50 drop-shadow mb-2 text-center">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-400 mb-6 text-center">
                {subtitle}
              </p>
            )}

            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
