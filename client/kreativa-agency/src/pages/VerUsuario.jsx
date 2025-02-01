import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Card, Button, Alert } from "react-bootstrap";

const VerUsuario = () => {
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const { data } = await axios.get(`http://localhost:4000/api/usuarios/${id}`);
        setUsuario(data);
      } catch (error) {
        console.error("Error al cargar el usuario:", error);
        setError("No se pudo cargar el usuario.");
      }
    };
    fetchUsuario();
  }, [id]);

  if (error) {
    return (
      <div className="container mt-4">
        <Alert variant="danger">{error}</Alert>
        <Link to="/usuarios" className="btn btn-primary">
          Volver a Usuarios
        </Link>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="container mt-4">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Detalles del Usuario</h2>
      <Card className="mt-3">
        <Card.Body>
          <Card.Title>{usuario.nombre}</Card.Title>
          <Card.Text>
            <strong>Usuario:</strong> {usuario.usuario}
          </Card.Text>
          <Card.Text>
            <strong>Email:</strong> {usuario.email}
          </Card.Text>
          <Card.Text>
            <strong>Tipo de Usuario:</strong> {usuario.tipo_usuario}
          </Card.Text>
          <Card.Text>
            <strong>Estado:</strong> {usuario.estado}
          </Card.Text>
          <Card.Text>
            <strong>Creado el:</strong> {new Date(usuario.fecha_creacion).toLocaleDateString()}
          </Card.Text>
          <Link to="/usuarios" className="btn btn-primary me-2">
            Volver
          </Link>
          <Link to={`/usuario/editar/${usuario._id}`} className="btn btn-warning">
            Editar
          </Link>
        </Card.Body>
      </Card>
    </div>
  );
};

export default VerUsuario;