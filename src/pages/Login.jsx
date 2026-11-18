import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Acceso directo de respaldo para el administrador y el cliente
    if (email === "admin@admin.co") {
      const adminUser = {
        nombre: "Administrador",
        correo: email,
        rol: "admin",
      };
      localStorage.setItem("usuarioHeladeria", JSON.stringify(adminUser));
      setUser(adminUser);
      navigate("/");
      return;
    }

    // Acceso de respaldo rápido para cliente
    if (email === "cliente@cliente.co") {
      const clienteUser = {
        nombre: "Cliente",
        correo: email,
        rol: "cliente",
      };
      localStorage.setItem("usuarioHeladeria", JSON.stringify(clienteUser));
      setUser(clienteUser);
      navigate("/");
      return;
    }

    // Acceso de respaldo rápido para empleado
    if (email === "empleado@empleado.co") {
      const empleadoUser = {
        nombre: "Empleado",
        correo: email,
        rol: "empleado",
      };
      localStorage.setItem("usuarioHeladeria", JSON.stringify(empleadoUser));
      setUser(empleadoUser);
      navigate("/");
      return;
    }

    try {
      const { data, err } = await supabase
        .from("usuarios") // Asegúrate de que tu tabla se llame usuarios o profiles
        .select("*")
        .eq("correo", email)
        .single();

      if (err || !data) {
        throw new Error("Credenciales inválidas o acceso denegado.");
      }

      const loggedUser = {
        nombre: data.nombre || "Usuario",
        correo: data.correo,
        rol: data.rol || "cliente",
      };
      localStorage.setItem("usuarioHeladeria", JSON.stringify(loggedUser));
      setUser(loggedUser);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Credenciales inválidas o acceso denegado.");
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "85vh" }}
    >
      <div
        className="card shadow-lg p-5 rounded-4 border-0"
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(15, 23, 42, 0.9)",
          border: "1px solid rgba(56, 189, 248, 0.3)",
        }}
      >
        <div className="text-center mb-4">
          <div className="fs-1 mb-2">🛡️</div>
          <h3 className="fw-bold text-info">Terminal Glacialis</h3>
          <p className="text-muted small">Autenticación de Usuarios</p>
        </div>

        {error && (
          <div className="alert alert-danger text-center py-2 small">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label text-light small">
              CORREO ELECTRÓNICO
            </label>
            <input
              type="email"
              className="form-control bg-dark text-light border-secondary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@admin.co"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label text-light small">CONTRASEÑA</label>
            <input
              type="password"
              className="form-control bg-dark text-light border-secondary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-info w-100 fw-bold rounded-pill text-dark py-2"
            style={{
              background: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
              border: "none",
            }}
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}
