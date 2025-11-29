// src/pages/Register.jsx
import { useState } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import api from "../api/axiosClient";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/register", form);
      navigate("/app");
    } catch (err) {
      setLoading(false);
      const msg =
        err?.response?.data?.error ||
        "Ocurrió un error al registrarte. Intenta de nuevo.";
      Swal.fire({
        icon: "error",
        title: "Ups",
        text: msg,
      });
    }
  };

  return (
    <AuthCard
      title="Crear cuenta"
      subtitle="Guarda y organiza tus códigos QR en un solo lugar."
      showBackHome
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-left">
          <label className="block text-xs font-semibold text-slate-200 mb-1">
            Nombre
          </label>
          <input
            type="text"
            name="name"
            className="w-full rounded-full px-4 py-2.5 text-sm bg-slate-900/70 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-slate-100 placeholder:text-slate-500"
            placeholder="Tu nombre"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

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
            placeholder="Mínimo 6 caracteres"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 rounded-full bg-cyan-500 text-slate-950 font-semibold py-2.5 text-sm shadow-lg shadow-cyan-500/40 hover:bg-cyan-400 transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Creando cuenta..." : "Registrarme"}
        </button>

        <div className="mt-3 text-xs text-slate-400 text-center">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="underline">
            Inicia sesión
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
