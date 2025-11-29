// src/pages/DashboardLayout.jsx
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axiosClient";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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
      {/* Glows de fondo estilo landing */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-32 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-20 h-80 w-80 rounded-full bg-indigo-500/25 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_transparent_60%)]" />
      </div>

      {/* Sidebar */}
      <aside className="relative z-10 w-64 bg-slate-950/80 border-r border-slate-800/80 hidden md:flex flex-col">
        {/* Header */}
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

        {/* Nav */}
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

        {/* Logout */}
        <div className="px-4 py-4 border-t border-slate-800/80 text-xs text-slate-400">
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-900/90 text-slate-200"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <main className="relative z-10 flex-1 flex flex-col">
        {/* Header móvil */}
        <header className="md:hidden px-4 py-3 border-b border-slate-800/80 flex justify-between items-center bg-slate-950/80">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center text-[10px] font-bold">
              QR
            </div>
            <div className="leading-tight">
              <p className="text-xs font-semibold">QR Universe</p>
              <p className="text-[10px] text-slate-400">
                {user?.name ? `Hola ${user.name}` : "Cargando usuario..."}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-[11px] px-3 py-1.5 rounded-full bg-slate-900 text-slate-100 border border-slate-700"
          >
            Cerrar sesión
          </button>
        </header>

        {/* Área principal */}
        <div className="flex-1 p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
