import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Login({ setUser }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Consultar usando 'password' tal como lo pide la guía oficial
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("correo", correo)
        .eq("password", password)
        .single();

      if (error || !data) {
        setError("Credenciales inválidas o acceso denegado.");
      } else {
        localStorage.setItem("usuarioHeladeria", JSON.stringify(data));
        setUser(data);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <div
        className="card shadow-lg border-0 p-4 rounded-4"
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(15, 23, 42, 0.85)",
          border: "1px solid rgba(56, 189, 248, 0.3)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="text-center mb-4">
          <div className="display-6 mb-2">🛡️</div>
          <h3 className="fw-bold text-info">Terminal Glacialis</h3>
          <p className="text-light opacity-50 small">
            Autenticación de Usuarios
          </p>
        </div>

        {error && (
          <div className="alert alert-danger bg-danger text-white border-0 py-2 small">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label text-light fw-semibold small">
              CORREO ELECTRÓNICO
            </label>
            <input
              type="email"
              className="form-control bg-dark text-light border-secondary"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="ej. admin@admin.co"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label text-light fw-semibold small">
              CONTRASEÑA
            </label>
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
            className="btn btn-info w-100 fw-bold py-2 text-dark rounded-pill"
            disabled={loading}
            style={{
              background: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
              border: "none",
            }}
          >
            {loading ? "Verificando..." : "Iniciar Sesión"}
          </button>
        </form>

        <div
          className="mt-4 text-center text-muted small border-top border-secondary pt-3"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          <p className="mb-2 text-light opacity-75">
            Cuentas oficiales del taller:
          </p>
          <div className="d-flex justify-content-center gap-1 flex-wrap">
            <span className="badge bg-secondary bg-opacity-50 text-info">
              admin@admin.co
            </span>
            <span className="badge bg-secondary bg-opacity-50 text-info">
              empleado@empleado.co
            </span>
            <span className="badge bg-secondary bg-opacity-50 text-info">
              cliente@cliente.co
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
