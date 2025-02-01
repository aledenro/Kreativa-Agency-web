import React, { useState } from "react";

const CrearUsuario = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    usuario: "",
    email: "",
    contraseña: "",
    tipo_usuario: "Cliente", 
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMensaje("Usuario creado exitosamente");
        setFormData({
          nombre: "",
          usuario: "",
          email: "",
          contraseña: "",
          tipo_usuario: "Cliente",
        });
      } else {
        setMensaje(data.mensaje || "Error al crear el usuario");
      }
    } catch (error) {
      setMensaje("Error en la conexión con el servidor");
    }
  };

  return (
    <div className="container mt-5">
      <h1>Crear Usuario</h1>
      {mensaje && <div className="alert alert-info">{mensaje}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">
            Nombre:
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            className="form-control"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="usuario" className="form-label">
            Usuario:
          </label>
          <input
            type="text"
            id="usuario"
            name="usuario"
            className="form-control"
            value={formData.usuario}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="contraseña" className="form-label">
            Contraseña:
          </label>
          <input
            type="password"
            id="contraseña"
            name="contraseña"
            className="form-control"
            value={formData.contraseña}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="tipo_usuario" className="form-label">
            Tipo de Usuario:
          </label>
          <select
            id="tipo_usuario"
            name="tipo_usuario"
            className="form-select"
            value={formData.tipo_usuario}
            onChange={handleChange}
            required
          >
            <option value="Administrador">Administrador</option>
            <option value="Colaborador">Colaborador</option>
            <option value="Cliente">Cliente</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Crear Usuario
        </button>
      </form>
    </div>
  );
};

export default CrearUsuario;