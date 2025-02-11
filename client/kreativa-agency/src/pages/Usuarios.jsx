import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar"; // Importar el Navbar

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
        <div>
            {/* Navbar */}
            <Navbar />

            {/* Contenido de la página */}
            <div className="container mt-5">
                <div className="section-title text-center">
                    <h1>Gestión de Usuarios</h1>
                </div>
                {error && (
                    <div className="alert alert-danger kreativa-alert">{error}</div>
                )}
                <div className="d-flex justify-content-start mb-3">
                    <button
                        className="thm-btn"
                        onClick={() => navigate("/usuario/crear")}
                    >
                        Crear Usuario
                    </button>
                </div>
                <div className="table-responsive">
                    <table className="table kreativa-table">
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
                                    <td className="acciones">
                                        <div className="botones-grupo">
                                            <button
                                                className="thm-btn thm-btn-small me-2"
                                                onClick={() => navigate(`/usuario/${usuario._id}`)}
                                            >
                                                Ver
                                            </button>
                                            <button
                                                className="thm-btn thm-btn-small me-2"
                                                onClick={() => navigate(`/usuario/editar/${usuario._id}`)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="thm-btn thm-btn-small"
                                                onClick={() => handleEliminar(usuario._id)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Usuarios;