import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("usuarioHeladeria");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold text-warning" to="/">
          🍨 Heladería Glacialis
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav align-items-center gap-2">
            <li className="nav-item">
              <Link className="nav-link" to="/catalogo">
                Catálogo
              </Link>
            </li>

            {/* Mostrar inventario si es admin o empleado */}
            {user && (user.rol === "admin" || user.rol === "empleado") && (
              <li className="nav-item">
                <Link className="nav-link" to="/inventario">
                  Inventario
                </Link>
              </li>
            )}

            {user ? (
              <li className="nav-item d-flex align-items-center ms-3 gap-3">
                <span className="badge bg-info text-dark px-3 py-2">
                  {user.nombre} ({user.rol})
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger btn-sm fw-bold"
                >
                  Cerrar Sesión
                </button>
              </li>
            ) : (
              <li className="nav-item ms-3">
                <Link
                  className="btn btn-warning text-dark fw-bold btn-sm px-3"
                  to="/login"
                >
                  Iniciar Sesión
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
