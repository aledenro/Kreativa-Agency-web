import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const VerUsuario = () => {
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/usuarios/${id}`);
        setUsuario(response.data);
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };
    fetchUsuario();
  }, [id]);

  if (!usuario) return <div>Cargando...</div>;

  return (
    <div>
      <h1>Detalles del Usuario</h1>
      <p>Nombre: {usuario.nombre}</p>
      <p>Usuario: {usuario.usuario}</p>
      <p>Email: {usuario.email}</p>
      <p>Tipo de Usuario: {usuario.tipo_usuario}</p>
    </div>
  );
};

export default VerUsuario;