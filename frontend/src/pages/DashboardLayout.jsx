// src/pages/DashboardLayout.jsx
import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axiosClient";

// Íconos y animación
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Estado menú móvil
  const [openMenu, setOpenMenu] = useState(false);

  // Evitar scroll cuando menú está abierto
  useEffect(() => {
    document.body.style.overflow = openMenu ? "hidden" : "auto";
  }, [openMenu]);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch (err) {
        navigate("/login");
      }
    };
    fetchMe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (_) {}
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden flex">
      {/* Glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-32 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-20 h-80 w-80 rounded-full bg-indigo-500/25 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_transparent_60%)]" />
      </div>

      {/*SIDEBAR DESKTOP */}
      <aside className="relative z-10 w-64 bg-slate-950/80 border-r border-slate-800/80 hidden md:flex flex-col">
        <div className="px-5 py-5 border-b border-slate-800/80 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center text-xs font-bold shadow-lg shadow-cyan-500/40">
            QR
          </div>
          <div className="leading-tight">
            <h1 className="text-sm font-semibold tracking-tight">
              QR Universe
            </h1>
            <p className="text-[11px] text-slate-400">
              Hola {user?.name?.toUpperCase?.() || "..."}
            </p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
          <NavLink
            to="/app"
            end
            className={({ isActive }) =>
              `block px-3 py-2 rounded-xl transition-colors ${
                isActive
                  ? "bg-cyan-500 text-slate-950 font-semibold shadow shadow-cyan-500/40"
                  : "text-slate-300 hover:bg-slate-900/80 hover:text-cyan-200"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/app/create"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-xl transition-colors ${
                isActive
                  ? "bg-emerald-500 text-slate-950 font-semibold shadow shadow-emerald-500/40"
                  : "text-slate-300 hover:bg-slate-900/80 hover:text-emerald-200"
              }`
            }
          >
            Crear QR
          </NavLink>

          <NavLink
            to="/app/my-codes"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-xl transition-colors ${
                isActive
                  ? "bg-sky-500 text-slate-950 font-semibold shadow shadow-sky-500/40"
                  : "text-slate-300 hover:bg-slate-900/80 hover:text-sky-200"
              }`
            }
          >
            Mis QRs
          </NavLink>
        </nav>

        <div className="px-4 py-4 border-t border-slate-800/80 text-xs text-slate-400">
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-900/90 text-slate-200"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/*BOTÓN HAMBURGUESA MOBILE */}
      <button
        onClick={() => setOpenMenu(true)}
        className="md:hidden fixed top-4 left-4 z-[50] p-2 rounded-xl bg-slate-900 border border-slate-800 shadow-lg shadow-black/40"
      >
        <Menu size={22} className="text-slate-200" />
      </button>

      {/* DRAWER MOBILE */}
      <AnimatePresence>
        {openMenu && (
          <>
            {/* Overlay oscuro */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenMenu(false)}
            />

            {/* Sidebar móvil */}
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: 0.25 }}
              className="fixed top-0 left-0 w-64 h-full bg-slate-950/95 border-r border-slate-800/80 z-50 p-5 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center text-xs font-bold">
                    QR
                  </div>
                  <div>
                    <h1 className="text-sm font-semibold">QR Universe</h1>
                    <p className="text-[11px] text-slate-400">
                      {user?.name ? `Hola ${user.name}` : "Cargando..."}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setOpenMenu(false)}
                  className="p-1 rounded-full bg-slate-900 border border-slate-700"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="space-y-2 text-sm font-medium">
                <NavLink
                  to="/app"
                  onClick={() => setOpenMenu(false)}
                  className="block px-3 py-2 rounded-xl hover:bg-slate-800/70"
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/app/create"
                  onClick={() => setOpenMenu(false)}
                  className="block px-3 py-2 rounded-xl hover:bg-slate-800/70"
                >
                  Crear QR
                </NavLink>

                <NavLink
                  to="/app/my-codes"
                  onClick={() => setOpenMenu(false)}
                  className="block px-3 py-2 rounded-xl hover:bg-slate-800/70"
                >
                  Mis QRs
                </NavLink>
              </nav>

              <button
                onClick={handleLogout}
                className="mt-6 w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-sm"
              >
                Cerrar sesión
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* CONTENIDO */}
      <main className="relative z-10 flex-1 flex flex-col">
        <div className="flex-1 p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
