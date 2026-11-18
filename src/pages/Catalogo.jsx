import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [rentabilidades, setRentabilidades] = useState([]);
  const [calorias, setCalorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [cantidades, setCantidades] = useState({});

  const usuarioGuardado = localStorage.getItem("usuarioHeladeria");
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  const rol = usuario ? usuario.rol : "cliente";

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const { data: prodData } = await supabase.from("productos").select("*");
      setProductos(prodData || []);

      const { data: calData } = await supabase
        .from("v_calorias_producto")
        .select("*");
      setCalorias(calData || []);

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

  const cambiarCantidad = (id, delta) => {
    setCantidades((prev) => {
      const actual = prev[id] || 1;
      const nuevo = actual + delta;
      return { ...prev, [id]: nuevo < 1 ? 1 : nuevo };
    });
  };

  const obtenerPrecio = (prod) => {
    if (!prod) return 0;

    // 1. Busca cualquier propiedad cuyo nombre incluya precio, valor o costo
    const keyMatch = Object.keys(prod).find((key) => {
      const k = key.toLowerCase();
      return (
        k.includes("precio") ||
        k.includes("valor") ||
        k.includes("costo") ||
        k.includes("price")
      );
    });

    if (keyMatch && typeof prod[keyMatch] === "number") {
      return prod[keyMatch];
    }

    // 2. Si no la encuentra por nombre, toma el primer número que encuentre que no sea el ID
    const numValue = Object.entries(prod).find(
      ([key, val]) => key !== "id" && typeof val === "number" && val > 0,
    );

    return numValue ? numValue[1] : 0;
  };

  const handleComprar = async (prod) => {
    setMensaje("");
    const cantidadSeleccionada = cantidades[prod.id] || 1;
    const precioUnitario = obtenerPrecio(prod);
    const totalVenta = precioUnitario * cantidadSeleccionada;

    try {
      const { error: ventaError } = await supabase.from("ventas").insert([
        {
          producto_id: prod.id,
          cantidad: cantidadSeleccionada,
          total: totalVenta,
        },
      ]);

      if (ventaError) throw ventaError;

      setMensaje(
        `¡Compra exitosa! ${cantidadSeleccionada}x ${prod.nombre} por $${totalVenta.toLocaleString()}`,
      );
      setTimeout(() => setMensaje(""), 5000);
    } catch (err) {
      console.error(err);
      setMensaje("Error al procesar la compra.");
    }
  };

  if (loading) {
    return (
      <div className="text-center text-info mt-5 fs-4">
        Cargando catálogo gourmet...
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-info display-6 mb-2">
          🍨 Catálogo de Productos - Glacialis
        </h2>
        <p className="text-light fs-5">
          Selecciona tus copas y malteadas favoritas, ajusta tu porción y
          disfruta
        </p>
      </div>

      {mensaje && (
        <div className="alert alert-info text-center fw-bold shadow-sm">
          {mensaje}
        </div>
      )}

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        {productos.map((prod) => {
          const infoCalorias = calorias.find(
            (c) =>
              c.id === prod.id ||
              c.producto_id === prod.id ||
              c.nombre === prod.nombre,
          );
          const infoRentabilidad = rentabilidades.find((r) => r.id === prod.id);

          const precioReal = obtenerPrecio(prod);
          const cant = cantidades[prod.id] || 1;
          const totalProducto = precioReal * cant;

          return (
            <div className="col" key={prod.id}>
              <div className="card h-100 bg-dark border border-secondary shadow-lg rounded-4 overflow-hidden">
                <div className="card-body d-flex flex-column justify-content-between p-4">
                  <div>
                    <h5 className="card-title text-info fw-bold mb-3">
                      {prod.nombre}
                    </h5>

                    <div
                      className="fw-bold fs-4 mb-2"
                      style={{ color: "#facc15" }}
                    >
                      💰 ${precioReal.toLocaleString()}
                    </div>

                    <div className="small mb-3" style={{ color: "#38bdf8" }}>
                      🔥 Calorías:{" "}
                      {infoCalorias
                        ? infoCalorias.total_calorias ||
                          infoCalorias.calorias ||
                          "350"
                        : "350"}{" "}
                      kcal
                    </div>
                  </div>

                  <div>
                    {/* Control interactivo de cantidad */}
                    <div className="d-flex align-items-center justify-content-between bg-black bg-opacity-70 p-2 rounded-3 mb-3 border border-secondary">
                      <span className="small text-info fw-bold">Cantidad:</span>
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-secondary text-white px-2"
                          onClick={() => cambiarCantidad(prod.id, -1)}
                        >
                          -
                        </button>
                        <span className="btn btn-dark border-secondary text-white px-3 fw-bold d-flex align-items-center">
                          {cant}
                        </span>
                        <button
                          className="btn btn-outline-secondary text-white px-2"
                          onClick={() => cambiarCantidad(prod.id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {rol === "admin" && infoRentabilidad && (
                      <div className="p-2 rounded bg-black border border-success mb-3 small">
                        <div className="text-success">
                          <strong>Costo:</strong> ${infoRentabilidad.costo}
                        </div>
                        <div className="text-info">
                          <strong>Rentabilidad:</strong> $
                          {infoRentabilidad.rentabilidad}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => handleComprar(prod)}
                      className="btn btn-info w-100 fw-bold rounded-pill shadow-sm text-dark py-2"
                    >
                      🛒{" "}
                      {rol === "cliente"
                        ? `Comprar ($${totalProducto.toLocaleString()})`
                        : "Gestionar Producto"}
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
