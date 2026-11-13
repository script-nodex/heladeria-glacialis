import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [rentabilidades, setRentabilidades] = useState([]);
  const [calorias, setCalorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  // Obtener rol del usuario actual desde localStorage
  const usuarioGuardado = localStorage.getItem("usuarioHeladeria");
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  const rol = usuario ? usuario.rol : "publico"; // admin, empleado, cliente, publico

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // 1. Consultar productos
      const { data: prodData } = await supabase.from("productos").select("*");
      setProductos(prodData || []);

      // 2. Consultar calorías (Vista)
      const { data: calData } = await supabase
        .from("v_calorias_producto")
        .select("*");
      setCalorias(calData || []);

      // 3. Consultar rentabilidad (Vista - solo si es admin)
      if (rol === "admin") {
        const { data: rentData } = await supabase
          .from("v_rentabilidad_producto")
          .select("*");
        setRentabilidades(rentData || []);
      }
    } catch (err) {
      console.error("Error cargando catálogo:", err);
    } finally {
      setLoading(false);
    }
  };

  // Función obligatoria del taller: Vender un producto y registrar venta
  const handleVender = async (productoId) => {
    setMensaje("");
    try {
      // Registrar en la tabla ventas
      const { error: ventaError } = await supabase
        .from("ventas")
        .insert([{ producto_id: productoId, cantidad: 1, total: 5000 }]); // Puedes ajustar el total dinámicamente si prefieres

      if (ventaError) throw ventaError;

      setMensaje("¡Venta realizada con éxito! Inventario actualizado.");
      setTimeout(() => setMensaje(""), 4000);
    } catch (err) {
      console.error(err);
      setMensaje("Error al procesar la venta.");
    }
  };

  if (loading) {
    return (
      <div className="text-center text-info mt-5">
        Cargando catálogo cuántico...
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-info">
          🍨 Catálogo de Productos - Glacialis
        </h2>
        <p className="text-muted">
          Explora nuestras copas y malteadas de alta gama
        </p>
        <span className="badge bg-secondary">
          Rol actual: {rol.toUpperCase()}
        </span>
      </div>

      {mensaje && (
        <div className="alert alert-success text-center">{mensaje}</div>
      )}

      <div className="row g-4">
        {productos.map((prod) => {
          const infoCalorias = calorias.find((c) => c.producto_id === prod.id);
          const infoRentabilidad = rentabilidades.find(
            (r) => r.producto_id === prod.id,
          );

          return (
            <div className="col-md-4" key={prod.id}>
              <div
                className="card h-100 shadow-lg border-0 rounded-4"
                style={{
                  background: "rgba(15, 23, 42, 0.9)",
                  border: "1px solid rgba(56, 189, 248, 0.2)",
                }}
              >
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h4 className="fw-bold text-light mb-0">{prod.nombre}</h4>
                      <span className="badge bg-info text-dark">
                        {prod.tipo}
                      </span>
                    </div>

                    <p className="text-warning fs-5 fw-bold mb-3">
                      ${prod.precio_publico}
                    </p>

                    {prod.tipo === "copa" && (
                      <p className="text-light opacity-75 small">
                        Vaso: {prod.vaso}
                      </p>
                    )}
                    {prod.tipo === "malteada" && (
                      <p className="text-light opacity-75 small">
                        Volumen: {prod.volumen_onzas} oz
                      </p>
                    )}

                    {/* Calorías ( Visible para todos ) */}
                    <div className="mb-2 text-light small">
                      🔥 <strong>Calorías:</strong>{" "}
                      {infoCalorias
                        ? infoCalorias.total_calorias
                        : "Calculando..."}{" "}
                      kcal
                    </div>

                    {/* Costo y Rentabilidad (SOLO para ADMIN según la guía) */}
                    {rol === "admin" && infoRentabilidad && (
                      <div className="p-2 rounded bg-dark border border-secondary mt-3 small">
                        <div className="text-success">
                          📈 <strong>Costo:</strong> ${infoRentabilidad.costo}
                        </div>
                        <div className="text-info">
                          💰 <strong>Rentabilidad:</strong> $
                          {infoRentabilidad.rentabilidad}
                        </div>
                      </div>
                    )}

                    {/* Para empleado (Ve costos pero NO rentabilidad o viceversa según directiva del taller) */}
                    {rol === "empleado" && (
                      <div className="p-2 rounded bg-dark border border-secondary mt-3 small text-muted">
                        🔒 Métricas financieras restringidas para tu rol.
                      </div>
                    )}
                  </div>

                  {/* Botón de Venta (Disponible para clientes, empleados y admin) */}
                  <div className="mt-4">
                    <button
                      onClick={() => handleVender(prod.id)}
                      className="btn btn-outline-info w-100 fw-bold rounded-pill shadow-sm"
                    >
                      🛒 Comprar / Vender Producto
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
