// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import GuestQR from "./pages/GuestQR";
import DashboardLayout from "./pages/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import CreateQR from "./pages/CreateQR";
import MyQRCodes from "./pages/MyQRCodes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing */}
        <Route path="/" element={<Landing />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Invitado */}
        <Route path="/guest" element={<GuestQR />} />

        {/* Dashboard protegido (más adelante le metemos protección) */}
        <Route path="/app" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="create" element={<CreateQR />} />
          <Route path="my-codes" element={<MyQRCodes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
