// src/pages/Landing.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden">
      {/* Glows de fondo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-32 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-20 h-80 w-80 rounded-full bg-indigo-500/25 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_transparent_60%)]" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10 flex flex-col gap-10">
        {/* Top bar */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
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
          </div>

          <Link
            to="/login"
            className="hidden sm:inline-flex text-xs font-medium px-3 py-1.5 rounded-full border border-slate-700/80 hover:border-cyan-400/70 hover:text-cyan-300 transition-colors"
          >
            Iniciar sesión
          </Link>
        </header>

        {/* Hero */}
        <main className="flex-1 flex items-center justify-center pb-6 md:pb-10">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full flex flex-col lg:flex-row items-center gap-10"
          >
            {/* Texto */}
            <div className="flex-1 space-y-4 text-center lg:text-left">
              <p className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-300/80 bg-cyan-500/10 border border-cyan-500/25 px-3 py-1 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Plataforma de códigos QR
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
                Tu panel central para
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400">
                  gestionar códigos QR
                </span>
              </h1>
              <p className="text-sm md:text-[15px] text-slate-300 max-w-xl mx-auto lg:mx-0">
                Genera QRs en segundos, guárdalos en tu cuenta y ten un
                dashboard claro con tus enlaces, recursos y campañas.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
                <Link
                  to="/register"
                  className="inline-flex justify-center items-center gap-2 px-6 py-3 rounded-full bg-cyan-500 text-slate-950 text-sm font-semibold shadow-lg shadow-cyan-500/40 hover:bg-cyan-400 transition-transform hover:-translate-y-0.5"
                >
                  Crear cuenta
                </Link>
                <Link
                  to="/guest"
                  className="inline-flex justify-center items-center gap-2 px-6 py-3 rounded-full bg-slate-900/70 text-slate-100 text-sm font-semibold border border-slate-700 hover:border-sky-400/70 hover:bg-slate-900 transition-transform hover:-translate-y-0.5"
                >
                  Entrar como invitado
                </Link>
              </div>

              <p className="text-[11px] text-slate-400 pt-1">
                O{" "}
                <Link
                  to="/login"
                  className="underline underline-offset-2 text-cyan-300"
                >
                  inicia sesión
                </Link>{" "}
                si ya tienes una cuenta.
              </p>
            </div>

            {/* Tarjeta preview */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="flex-1 flex justify-center"
            >
              <div className="relative w-full max-w-xs">
                <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-500 opacity-70 blur-[2px]" />
                <div className="relative rounded-3xl bg-slate-950/90 border border-slate-800/80 px-5 py-5 shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                        Vista rápida
                      </p>
                      <p className="text-sm font-semibold text-slate-50">
                        Código QR dinámico
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/40">
                      Online
                    </span>
                  </div>

                  <div className="aspect-square rounded-2xl bg-slate-900 flex items-center justify-center border border-slate-800 mb-4">
                    <div className="h-[70%] w-[70%] rounded-2xl bg-gradient-to-br from-slate-50 to-slate-300 flex items-center justify-center text-slate-900 text-[10px] font-semibold">
                      QR PREVIEW
                    </div>
                  </div>

                  <div className="space-y-2 text-[11px] text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Título</span>
                      <span className="font-medium text-slate-50">
                        Landing campaña ITT
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Destino</span>
                      <span className="font-mono text-[10px] text-sky-300 truncate max-w-[160px]">
                        https://proyecto-qr-universe.com/itt
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-500">Guardado en</span>
                      <span className="text-slate-200">Dashboard personal</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
