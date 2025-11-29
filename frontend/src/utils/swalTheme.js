import Swal from "sweetalert2";

export const darkSwal = Swal.mixin({
  // 👇 antes: "transparent"
  background: "#020617", // fondo sólido del popup
  backdrop: "rgba(0,0,0,0.75)", // oscurece lo de atrás

  color: "#e5e7eb",
  buttonsStyling: false,
  customClass: {
    popup:
      "bg-slate-950/95 border border-slate-800/80 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.85)] px-8 pt-8 pb-6",
    title: "text-slate-50 text-xl font-extrabold mb-2",
    htmlContainer: "text-slate-400 text-sm",
    confirmButton:
      "mt-4 px-6 py-2.5 rounded-full bg-cyan-500 text-slate-950 text-sm font-semibold shadow-lg shadow-cyan-500/40 hover:bg-cyan-400 focus:outline-none focus:ring-0 transition-transform hover:-translate-y-0.5",
    cancelButton:
      "mt-4 ml-2 px-5 py-2.5 rounded-full bg-slate-900 text-slate-100 text-sm font-medium border border-slate-700 hover:bg-slate-800 transition-colors",
    icon: "border-none",
  },
});

export const showQrSavedAlert = () =>
  darkSwal.fire({
    icon: "success",
    iconColor: "#22d3ee",
    title: "QR guardado",
    html: "Tu código QR se ha guardado en tu cuenta.",
  });

export const showErrorAlert = (title, message) => {
  const safeTitle =
    typeof title === "string" && title.trim() ? title : "Ups";
  const safeMessage =
    typeof message === "string" && message.trim()
      ? message
      : "Ocurrió un error.";

  return darkSwal.fire({
    icon: "error",
    iconColor: "#f97373",
    title: safeTitle,
    html: safeMessage,
  });
};

export const showWarningAlert = (title, message) => {
  const safeTitle =
    typeof title === "string" && title.trim() ? title : "Atención";
  const safeMessage =
    typeof message === "string" && message.trim()
      ? message
      : "Revisa la información.";

  return darkSwal.fire({
    icon: "warning",
    iconColor: "#facc15",
    title: safeTitle,
    html: safeMessage,
  });
};
