import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Inventario() {
  const [ingredientes, setIngredientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  // Estado para el formulario
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [calorias, setCalorias] = useState("");
  const [inventario, setInventario] = useState("");
  const [tipo, setTipo] = useState("base");
  const [sabor, setSabor] = useState("");
  const [esVegetariano, setEsVegetariano] = useState(true);
  const [esSano, setEsSano] = useState(true);

  useEffect(() => {
    cargarIngredientes();
  }, []);

  const cargarIngredientes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("ingredientes")
      .select("*")
      .order("id", { ascending: true });
    if (error) {
      console.error("Error cargando ingredientes:", error);
    } else {
      setIngredientes(data || []);
    }
    setLoading(false);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setMensaje("");

    if (Number(precio) < 0 || Number(calorias) < 0 || Number(inventario) < 0) {
      setMensaje("❌ El precio, calorías y stock no pueden ser negativos.");
      return;
    }

    try {
      const { error } = await supabase.from("ingredientes").insert([
        {
          nombre,
          precio: parseFloat(precio),
          calorias: parseInt(calorias),
          inventario: parseInt(inventario),
          tipo,
          sabor: tipo === "base" ? sabor : null,
          es_vegetariano: esVegetariano,
          es_sano: esSano,
        },
      ]);

      if (error) throw error;

      setMensaje("¡Ingrediente agregado con éxito!");
      setNombre("");
      setPrecio("");
      setCalorias("");
      setInventario("");
      setSabor("");
      cargarIngredientes(); // Esto recarga la lista y actualiza el stock total automáticamente
    } catch (err) {
      console.error(err);
      setMensaje("Error al guardar el ingrediente.");
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este ingrediente?")) return;

    try {
      const { error } = await supabase
        .from("ingredientes")
        .delete()
        .eq("id", id);
      if (error) throw error;
      setMensaje("Ingrediente eliminado correctamente.");
      cargarIngredientes(); // Esto recarga la lista y actualiza el stock total automáticamente
    } catch (err) {
      console.error(err);
      setMensaje("No se pudo eliminar el ingrediente.");
    }
  };

  // Cálculo automático y reactivo del total de registros y stock total
  const totalItems = ingredientes.length;
  const stockTotalUnidades = ingredientes.reduce(
    (acc, curr) => acc + (Number(curr.inventario) || 0),
    0,
  );

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-info">
          🧪 Control de Inventario e Ingredientes
        </h2>
        <p className="text-light">
          Administración y control de bases, complementos y stock
        </p>
      </div>

      {mensaje && <div className="alert alert-info text-center">{mensaje}</div>}

      <div
        className="card shadow-lg border-0 p-4 rounded-4 mb-5"
        style={{
          background: "rgba(15, 23, 42, 0.9)",
          border: "1px solid rgba(56, 189, 248, 0.3)",
        }}
      >
        <h4 className="text-light mb-4">Agregar Nuevo Ingrediente</h4>
        <form onSubmit={handleGuardar}>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label text-light small">
                Nombre del Ingrediente
              </label>
              <input
                type="text"
                className="form-control bg-dark text-light border-secondary"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Helado de Fresa"
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label text-light small">Precio ($)</label>
              <input
                type="number"
                min="0"
                step="100"
                className="form-control bg-dark text-light border-secondary"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="Ej. 2000"
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label text-light small">
                Calorías (kcal)
              </label>
              <input
                type="number"
                min="0"
                className="form-control bg-dark text-light border-secondary"
                value={calorias}
                onChange={(e) => setCalorias(e.target.value)}
                placeholder="Ej. 180"
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label text-light small">
                Stock (unidades)
              </label>
              <input
                type="number"
                min="0"
                className="form-control bg-dark text-light border-secondary"
                value={inventario}
                onChange={(e) => setInventario(e.target.value)}
                placeholder="Ej. 40"
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label text-light small">Tipo</label>
              <select
                className="form-select bg-dark text-light border-secondary"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="base">Base (Helado)</option>
                <option value="complemento">Complemento (Topping)</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label text-light small">
                Sabor (si es base)
              </label>
              <input
                type="text"
                className="form-control bg-dark text-light border-secondary"
                value={sabor}
                onChange={(e) => setSabor(e.target.value)}
                placeholder="Ej. Fresa"
              />
            </div>

            <div className="col-12 d-flex gap-4 mt-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={esVegetariano}
                  onChange={(e) => setEsVegetariano(e.target.checked)}
                  id="vegCheck"
                />
                <label
                  className="form-check-label text-light small"
                  htmlFor="vegCheck"
                >
                  Es Vegetariano
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={esSano}
                  onChange={(e) => setEsSano(e.target.checked)}
                  id="sanoCheck"
                />
                <label
                  className="form-check-label text-light small"
                  htmlFor="sanoCheck"
                >
                  Es Saludable
                </label>
              </div>
            </div>

            <div className="col-12 mt-4">
              <button
                type="submit"
                className="btn btn-info w-100 fw-bold rounded-pill text-dark"
                style={{
                  background: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
                  border: "none",
                }}
              >
                Guardar Ingrediente en el Sistema
              </button>
            </div>
          </div>
        </form>
      </div>

      <div
        className="card shadow-lg border-0 p-4 rounded-4"
        style={{
          background: "rgba(15, 23, 42, 0.9)",
          border: "1px solid rgba(56, 189, 248, 0.2)",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <h4 className="text-light m-0">Listado de Ingredientes Actuales</h4>
          <div className="d-flex gap-3">
            <span className="badge bg-secondary p-2">
              Total Registros: <strong>{totalItems}</strong>
            </span>
            {/* El stock total se actualiza en vivo al agregar o borrar */}
            <span className="badge bg-info text-dark p-2">
              Stock Total: <strong>{stockTotalUnidades} unidades</strong>
            </span>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-info">Cargando inventario...</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Sabor</th>
                  <th>Precio</th>
                  <th>Calorías</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ingredientes.map((ing) => (
                  <tr key={ing.id}>
                    <td className="fw-bold">{ing.nombre}</td>
                    <td>
                      <span className="badge bg-secondary">{ing.tipo}</span>
                    </td>
                    <td>{ing.sabor || "N/A"}</td>
                    <td>${ing.precio}</td>
                    <td>{ing.calorias} kcal</td>
                    <td>
                      <span className="badge bg-success">
                        {ing.inventario} unidades
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleEliminar(ing.id)}
                        className="btn btn-sm btn-outline-danger rounded-pill px-3"
                      >
                        🗑️ Borrar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
