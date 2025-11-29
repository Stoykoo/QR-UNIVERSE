// src/pages/ForgotPassword.jsx
import { useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import AuthCard from "../components/AuthCard";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    await Swal.fire({
      icon: "info",
      title: "Función en desarrollo",
      text: "Por ahora esta pantalla es solo UI. Después conectamos el flujo de recuperación.",
    });

    setSending(false);
  };

  return (
    <AuthCard
      title="Recuperar contraseña"
      subtitle="Te enviaremos instrucciones para restablecerla."
      showBackHome
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-left">
          <label className="block text-xs font-semibold text-slate-200 mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            className="w-full rounded-full px-4 py-2.5 text-sm bg-slate-900/70 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-slate-100 placeholder:text-slate-500"
            placeholder="tucorreo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={sending}
          className="w-full mt-2 rounded-full bg-sky-500 text-slate-950 font-semibold py-2.5 text-sm shadow-lg shadow-sky-500/40 hover:bg-sky-400 transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {sending ? "Enviando..." : "Enviar instrucciones"}
        </button>

        <div className="mt-3 text-xs text-slate-400 text-center">
          ¿Ya la recordaste?{" "}
          <Link to="/login" className="underline">
            Volver a iniciar sesión
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
