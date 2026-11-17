import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Catalogo from "./pages/Catalogo";
import Inventario from "./pages/Inventario";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("usuarioHeladeria");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark px-4"
      style={{
        background: "rgba(15, 23, 42, 0.95)",
        borderBottom: "1px solid rgba(56, 189, 248, 0.2)",
      }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-info" to="/">
          Heladería Glacialis
        </Link>
        <div className="collapse navbar-collapse justify-content-end">
          {user ? (
            <ul className="navbar-nav align-items-center gap-3">
              <li className="nav-item">
                <Link className="nav-link text-light" to="/catalogo">
                  Catálogo
                </Link>
              </li>
              {user.rol === "admin" && (
                <li className="nav-item">
                  <Link className="nav-link text-light" to="/inventario">
                    Inventario
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <span className="badge bg-info text-dark px-3 py-2">
                  {user.nombre} ({user.rol})
                </span>
              </li>
              <li className="nav-item">
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger btn-sm rounded-pill px-3"
                >
                  Cerrar Sesión
                </button>
              </li>
            </ul>
          ) : (
            <Link
              className="btn btn-info btn-sm rounded-pill px-4 text-dark fw-bold"
              to="/login"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function Home({ user }) {
  return (
    <div
      className="container text-center py-5"
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="display-4 mb-3">🍨</div>
      <h1 className="fw-bold text-info display-5 mb-3">Glacialis Core</h1>
      <p className="text-light opacity-75 mb-4" style={{ maxWidth: "600px" }}>
        Sistema inteligente de gestión de inventarios, control de roles y
        operaciones para heladerías de alta gama.
      </p>

      {/* Seguridad estricta en la vista de inicio */}
      {user ? (
        <div
          className="card shadow-lg p-4 rounded-4 border-0"
          style={{
            background: "rgba(15, 23, 42, 0.85)",
            border: "1px solid rgba(56, 189, 248, 0.3)",
          }}
        >
          <p className="text-light mb-3">
            🚀 Sesión activa como:{" "}
            <strong className="text-info">{user.nombre}</strong>{" "}
            <span className="badge bg-info text-dark">{user.rol}</span>
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Link
              to="/catalogo"
              className="btn btn-info rounded-pill px-4 fw-bold text-dark"
            >
              Explorar Catálogo
            </Link>
            {user.rol === "admin" && (
              <Link
                to="/inventario"
                className="btn btn-outline-info rounded-pill px-4 fw-bold"
              >
                Panel de Inventario
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div
          className="card shadow-lg p-4 rounded-4 border-0"
          style={{
            background: "rgba(15, 23, 42, 0.85)",
            border: "1px solid rgba(56, 189, 248, 0.3)",
          }}
        >
          <p className="text-light mb-3">
            🔒 Área restringida. Debe iniciar sesión para acceder al sistema.
          </p>
          <Link
            to="/login"
            className="btn btn-info btn-lg rounded-pill px-5 fw-bold text-dark shadow-lg"
          >
            Acceder al Sistema
          </Link>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("usuarioHeladeria");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <Router>
      <div
        style={{ minHeight: "100vh", background: "#0b0f19", color: "#f8fafc" }}
      >
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route
            path="/catalogo"
            element={user ? <Catalogo /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/inventario"
            element={
              user && user.rol === "admin" ? (
                <Inventario />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
