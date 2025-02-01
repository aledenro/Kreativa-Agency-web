import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Table, Button, Alert } from "react-bootstrap";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/usuarios");
        setUsuarios(data);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
        setError("No se pudieron cargar los usuarios.");
      }
    };
    fetchUsuarios();
  }, []);

  const eliminarUsuario = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      try {
        await axios.delete(`http://localhost:4000/api/usuarios/${id}`);
        setUsuarios(usuarios.filter((usuario) => usuario._id !== id));
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        setError("No se pudo eliminar el usuario.");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Gestión de Usuarios</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Link to="/usuario/crear" className="btn btn-primary mb-3">
        Crear Usuario
      </Link>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Usuario</th>
            <th>Email</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario._id}>
              <td>{usuario.nombre}</td>
              <td>{usuario.usuario}</td>
              <td>{usuario.email}</td>
              <td>{usuario.tipo_usuario}</td>
              <td>
                <Link to={`/usuario/${usuario._id}`} className="btn btn-info btn-sm me-2">
                  Ver
                </Link>
                <Link to={`/usuario/editar/${usuario._id}`} className="btn btn-warning btn-sm me-2">
                  Editar
                </Link>
                <Button variant="danger" size="sm" onClick={() => eliminarUsuario(usuario._id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Usuarios;