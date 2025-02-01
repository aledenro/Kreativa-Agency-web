import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const EditarUsuario = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nombre: "",
    usuario: "",
    email: "",
    contraseña: "",
    tipo_usuario: "Cliente",
  });

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/usuarios/${id}`);
        setFormData(response.data);
      } catch (error) {
        console.error("Error al cargar el usuario:", error);
      }
    };
    fetchUsuario();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:4000/api/usuarios/${id}`, formData);
      alert("Usuario actualizado exitosamente.");
      window.location.href = "/usuarios";
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      alert("Ocurrió un error al intentar actualizar el usuario.");
    }
  };

  return (
    <div>
      <h1>Editar Usuario</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="nombre"
          value={formData.nombre}
          placeholder="Nombre"
          onChange={handleChange}
        />
        <input
          name="usuario"
          value={formData.usuario}
          placeholder="Usuario"
          onChange={handleChange}
        />
        <input
          name="email"
          value={formData.email}
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          name="contraseña"
          type="password"
          placeholder="Nueva Contraseña"
          onChange={handleChange}
        />
        <select name="tipo_usuario" value={formData.tipo_usuario} onChange={handleChange}>
          <option value="Cliente">Cliente</option>
          <option value="Colaborador">Colaborador</option>
          <option value="Administrador">Administrador</option>
        </select>
        <button type="submit">Actualizar</button>
      </form>
    </div>
  );
};

export default EditarUsuario;