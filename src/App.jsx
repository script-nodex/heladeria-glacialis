import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Catalogo from "./pages/Catalogo";
import Inventario from "./pages/Inventario";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("usuarioHeladeria");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Componente para proteger rutas privadas
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    if (allowedRoles && !allowedRoles.includes(user.rol)) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#0b0f19",
          color: "#f8f9fa",
        }}
      >
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route
            path="/"
            element={
              <div className="container py-5">
                <div
                  className="p-5 mb-4 rounded-4 shadow-lg text-center position-relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)",
                    border: "1px solid rgba(56, 189, 248, 0.3)",
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 0 40px rgba(14, 165, 233, 0.15)",
                  }}
                >
                  <div
                    className="position-absolute top-0 start-50 translate-middle-x"
                    style={{
                      width: "300px",
                      height: "100px",
                      background: "rgba(56, 189, 248, 0.15)",
                      filter: "blur(60px)",
                      borderRadius: "50%",
                    }}
                  ></div>

                  <h1
                    className="display-3 fw-bold mb-3"
                    style={{
                      background:
                        "linear-gradient(90deg, #38bdf8, #818cf8, #c084fc)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    🍦 Glacialis Core V2
                  </h1>
                  <p
                    className="lead text-light opacity-75 mb-4"
                    style={{ maxWidth: "600px", margin: "0 auto" }}
                  >
                    Sistema inteligente de gestión de inventarios, control de
                    roles y operaciones cuánticas para heladerías de alta gama.
                  </p>

                  {user ? (
                    <div
                      className="alert d-inline-block px-4 py-3 rounded-pill text-light mb-4"
                      style={{
                        background: "rgba(56, 189, 248, 0.1)",
                        border: "1px solid rgba(56, 189, 248, 0.3)",
                      }}
                    >
                      ✨ Sesión activa como:{" "}
                      <strong className="text-info">{user.nombre}</strong>{" "}
                      <span className="badge bg-info text-dark ms-2">
                        {user.rol}
                      </span>
                    </div>
                  ) : (
                    <div
                      className="alert d-inline-block px-4 py-2 rounded-pill text-warning mb-4"
                      style={{
                        background: "rgba(234, 179, 8, 0.1)",
                        border: "1px solid rgba(234, 179, 8, 0.3)",
                      }}
                    >
                      🔒 Acceso restringido. Por favor inicia sesión para
                      habilitar los módulos.
                    </div>
                  )}

                  <div className="d-flex justify-content-center gap-3 flex-wrap mt-3">
                    <Link
                      to="/catalogo"
                      className="btn btn-info fw-bold px-4 py-3 shadow-sm text-dark rounded-pill"
                      style={{
                        background: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
                        border: "none",
                      }}
                    >
                      🚀 Explorar Catálogo
                    </Link>

                    {user &&
                    (user.rol === "admin" || user.rol === "empleado") ? (
                      <Link
                        to="/inventario"
                        className="btn btn-outline-info fw-bold px-4 py-3 rounded-pill"
                        style={{ borderColor: "#38bdf8", color: "#38bdf8" }}
                      >
                        📦 Panel de Inventario
                      </Link>
                    ) : (
                      <button
                        className="btn btn-outline-secondary fw-bold px-4 py-3 rounded-pill disabled"
                        style={{ opacity: 0.5 }}
                      >
                        🔒 Inventario (Bloqueado)
                      </button>
                    )}

                    {!user && (
                      <Link
                        to="/login"
                        className="btn btn-warning fw-bold px-4 py-3 rounded-pill text-dark shadow-sm"
                      >
                        🔑 Iniciar Sesión
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            }
          />

          <Route path="/login" element={<Login setUser={setUser} />} />

          <Route
            path="/catalogo"
            element={
              <ProtectedRoute>
                <Catalogo />
              </ProtectedRoute>
            }
          />

          <Route
            path="/inventario"
            element={
              <ProtectedRoute allowedRoles={["admin", "empleado"]}>
                <Inventario />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
