import React, { useEffect, useState } from "react";
import axios from "axios";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);

  // Cargar usuarios al iniciar el componente
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/usuarios");
        setUsuarios(response.data);
      } catch (error) {
        console.error("Error al cargar los usuarios:", error);
      }
    };
    fetchUsuarios();
  }, []);

  // Manejar eliminación de usuario
  const eliminarUsuario = async (id) => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar este usuario?");
    if (confirmacion) {
      try {
        await axios.delete(`http://localhost:4000/api/usuarios/${id}`);
        alert("Usuario eliminado correctamente.");
        setUsuarios(usuarios.filter((usuario) => usuario._id !== id));
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        alert("Ocurrió un error al intentar eliminar el usuario.");
      }
    }
  };

  return (
    <div>
      <h1>Gestión de Usuarios</h1>
      <button onClick={() => (window.location.href = "/usuario/crear")}>Crear Usuario</button>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Usuario</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario._id}>
              <td>{usuario.nombre}</td>
              <td>{usuario.usuario}</td>
              <td>{usuario.email}</td>
              <td>
                <button onClick={() => (window.location.href = `/usuario/${usuario._id}`)}>Ver</button>
                <button onClick={() => (window.location.href = `/usuario/editar/${usuario._id}`)}>Editar</button>
                <button onClick={() => eliminarUsuario(usuario._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Usuarios;