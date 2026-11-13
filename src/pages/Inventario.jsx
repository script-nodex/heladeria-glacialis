import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Inventario() {
  const [ingredientes, setIngredientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nuevoIngrediente, setNuevoIngrediente] = useState({
    nombre: "",
    precio: "",
    calorias: "",
    inventario: "",
    es_vegetariano: false,
    es_sano: true,
    tipo: "base",
    sabor: "",
  });

  useEffect(() => {
    fetchIngredientes();
  }, []);

  const fetchIngredientes = async () => {
    try {
      const { data, error } = await supabase.from("ingredientes").select("*");
      if (error) {
        console.error("Error al cargar ingredientes:", error.message);
      } else {
        setIngredientes(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNuevoIngrediente({
      ...nuevoIngrediente,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("ingredientes").insert([
        {
          nombre: nuevoIngrediente.nombre,
          precio: parseFloat(nuevoIngrediente.precio),
          calorias: parseInt(nuevoIngrediente.calorias),
          inventario: parseInt(nuevoIngrediente.inventario),
          es_vegetariano: nuevoIngrediente.es_vegetariano,
          es_sano: nuevoIngrediente.es_sano,
          tipo: nuevoIngrediente.tipo,
          sabor: nuevoIngrediente.sabor,
        },
      ]);

      if (error) {
        alert("Error al guardar: " + error.message);
      } else {
        // Limpiar formulario y recargar datos
        setNuevoIngrediente({
          nombre: "",
          precio: "",
          calorias: "",
          inventario: "",
          es_vegetariano: false,
          es_sano: true,
          tipo: "base",
          sabor: "",
        });
        fetchIngredientes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container py-4">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary">
          📦 Control de Inventario e Ingredientes
        </h2>
        <p className="text-muted">
          Administración y control de bases y complementos de la heladería.
        </p>
      </div>

      {/* Formulario para registrar ingrediente */}
      <div className="card shadow-sm border-0 mb-5 p-4 bg-light">
        <h5 className="fw-bold mb-3 text-secondary">
          Agregar Nuevo Ingrediente
        </h5>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-4">
            <label className="form-label fw-semibold">Nombre</label>
            <input
              type="text"
              className="form-control"
              name="nombre"
              value={nuevoIngrediente.nombre}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold">Precio ($)</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              name="precio"
              value={nuevoIngrediente.precio}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold">Calorías</label>
            <input
              type="number"
              className="form-control"
              name="calorias"
              value={nuevoIngrediente.calorias}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold">Stock (Inventario)</label>
            <input
              type="number"
              className="form-control"
              name="inventario"
              value={nuevoIngrediente.inventario}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold">Tipo</label>
            <select
              className="form-select"
              name="tipo"
              value={nuevoIngrediente.tipo}
              onChange={handleInputChange}
            >
              <option value="base">Base</option>
              <option value="complemento">Complemento</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold">Sabor</label>
            <input
              type="text"
              className="form-control"
              name="sabor"
              value={nuevoIngrediente.sabor}
              onChange={handleInputChange}
              placeholder="Ej. Vainilla, Fresa..."
            />
          </div>
          <div className="col-md-6 d-flex align-items-center gap-4 mt-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="es_vegetariano"
                id="vegCheck"
                checked={nuevoIngrediente.es_vegetariano}
                onChange={handleInputChange}
              />
              <label
                className="form-check-label fw-semibold"
                htmlFor="vegCheck"
              >
                Es Vegetariano
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="es_sano"
                id="sanoCheck"
                checked={nuevoIngrediente.es_sano}
                onChange={handleInputChange}
              />
              <label
                className="form-check-label fw-semibold"
                htmlFor="sanoCheck"
              >
                Es Saludable
              </label>
            </div>
          </div>
          <div className="col-md-6 text-end mt-3">
            <button
              type="submit"
              className="btn btn-primary px-4 fw-bold shadow-sm"
            >
              Guardar Ingrediente
            </button>
          </div>
        </form>
      </div>

      {/* Tabla de Existencias */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h4 className="fw-bold mb-3 text-dark">
            Listado de Ingredientes Actuales
          </h4>
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : ingredientes.length === 0 ? (
            <div className="alert alert-info text-center m-0">
              No hay ingredientes registrados en el inventario.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Sabor</th>
                    <th>Precio</th>
                    <th>Calorías</th>
                    <th>Stock</th>
                    <th>Atributos</th>
                  </tr>
                </thead>
                <tbody>
                  {ingredientes.map((item) => (
                    <tr key={item.id}>
                      <td className="fw-bold">{item.nombre}</td>
                      <td>
                        <span
                          className={`badge ${item.tipo === "base" ? "bg-info text-dark" : "bg-secondary"}`}
                        >
                          {item.tipo}
                        </span>
                      </td>
                      <td>{item.sabor || "N/A"}</td>
                      <td>${item.precio}</td>
                      <td>{item.calorias} kcal</td>
                      <td>
                        <span
                          className={`badge ${item.inventario > 5 ? "bg-success" : "bg-danger"}`}
                        >
                          {item.inventario} unidades
                        </span>
                      </td>
                      <td>
                        {item.es_vegetariano && (
                          <span className="badge bg-success me-1">Veg</span>
                        )}
                        {item.es_sano && (
                          <span className="badge bg-warning text-dark">
                            Sano
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
