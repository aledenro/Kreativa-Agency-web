import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";

const EditarUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    usuario: "",
    email: "",
    tipo_usuario: "",
    estado: "Activo",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    // Obtener datos del usuario actual
    const fetchUsuario = async () => {
      try {
        const { data } = await axios.get(`http://localhost:4000/api/usuarios/${id}`);
        setFormData(data);
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
        setError("No se pudo cargar el usuario.");
      }
    };
    fetchUsuario();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.nombre || !formData.usuario || !formData.email || !formData.tipo_usuario) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Por favor, ingresa un correo válido.");
      return;
    }

    try {
      await axios.put(`http://localhost:4000/api/usuarios/${id}`, formData);
      navigate("/usuarios");
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      setError("No se pudo actualizar el usuario.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Editar Usuario</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ingresa el nombre completo"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Usuario</Form.Label>
          <Form.Control
            type="text"
            name="usuario"
            value={formData.usuario}
            onChange={handleChange}
            placeholder="Ingresa el nombre de usuario"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="usuario@email.com"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Tipo de Usuario</Form.Label>
          <Form.Select name="tipo_usuario" value={formData.tipo_usuario} onChange={handleChange}>
            <option value="">Seleccione un tipo</option>
            <option value="Administrador">Administrador</option>
            <option value="Colaborador">Colaborador</option>
            <option value="Cliente">Cliente</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Estado</Form.Label>
          <Form.Select name="estado" value={formData.estado} onChange={handleChange}>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </Form.Select>
        </Form.Group>
        <Button variant="primary" type="submit">
          Guardar Cambios
        </Button>
      </Form>
    </div>
  );
};

export default EditarUsuario;