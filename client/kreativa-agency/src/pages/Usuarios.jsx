import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Usuarios = () => {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const { data } = await axios.get("http://localhost:4000/api/usuarios");
                setUsuarios(data);
            } catch (error) {
                setError("Error al cargar los usuarios");
            }
        };
        fetchUsuarios();
    }, []);

    const handleEliminar = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/api/usuarios/${id}`);
            setUsuarios(usuarios.filter((usuario) => usuario._id !== id));
        } catch (error) {
            setError("Error al eliminar el usuario");
        }
    };

    return (
        <div className="container mt-5">
            <h1>Gestión de Usuarios</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <button
                className="btn btn-primary mb-3"
                onClick={() => navigate("/usuario/crear")}
            >
                Crear Usuario
            </button>
            <table className="table">
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
                                <button
                                    className="btn btn-info btn-sm me-2"
                                    onClick={() => navigate(`/usuario/${usuario._id}`)}
                                >
                                    Ver
                                </button>
                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => navigate(`/usuario/editar/${usuario._id}`)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleEliminar(usuario._id)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Usuarios;