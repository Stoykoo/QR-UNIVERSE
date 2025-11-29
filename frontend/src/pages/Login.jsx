// src/pages/Login.jsx
import { useState } from "react";
import { darkSwal, showQrSavedAlert, showErrorAlert } from "../utils/swalTheme";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthCard from "../components/AuthCard";
import api from "../api/axiosClient";

const MIN_LOADING_TIME = 700; // ms

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const start = Date.now();

    try {
      await api.post("/auth/login", form);

      const elapsed = Date.now() - start;
      const wait = Math.max(MIN_LOADING_TIME - elapsed, 0);

      setTimeout(() => {
        navigate("/app");
      }, wait);
    } catch (err) {
      const elapsed = Date.now() - start;
      const wait = Math.max(MIN_LOADING_TIME - elapsed, 0);

      setTimeout(() => {
        setLoading(false);
        const msg =
          err?.response?.data?.error ||
          "Ocurrió un error al iniciar sesión. Intenta de nuevo.";
        darkSwal.fire({
          icon: "error",
          title: "Ups",
          text: msg,
        });
      }, wait);
    }
  };

  return (
    <AuthCard
      title="Iniciar sesión"
      subtitle="Accede a tu dashboard de códigos QR."
      showBackHome
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-left">
          <label className="block text-xs font-semibold text-slate-200 mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            className="w-full rounded-full px-4 py-2.5 text-sm bg-slate-900/70 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-slate-100 placeholder:text-slate-500"
            placeholder="tucorreo@ejemplo.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="text-left">
          <label className="block text-xs font-semibold text-slate-200 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            name="password"
            className="w-full rounded-full px-4 py-2.5 text-sm bg-slate-900/70 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-slate-100 placeholder:text-slate-500"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileTap={loading ? {} : { scale: 0.97 }}
          className="w-full mt-2 rounded-full bg-cyan-500 text-slate-950 font-semibold py-2.5 text-sm shadow-lg shadow-cyan-500/40 hover:bg-cyan-400 transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="flex items-center justify-center gap-2">
            {loading && (
              <span className="w-4 h-4 border-2 border-slate-900/50 border-t-transparent rounded-full animate-spin" />
            )}
            <span>{loading ? "Iniciando sesión..." : "Entrar"}</span>
          </span>
        </motion.button>

        <div className="mt-3 flex justify-between text-xs text-slate-400">
          <Link to="/forgot-password" className="underline">
            Olvidé mi contraseña
          </Link>
          <Link to="/register" className="underline">
            Crear cuenta
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
