import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar"; // Importar el Navbar

const VerUsuario = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const { data } = await axios.get(`http://localhost:4000/api/usuarios/${id}`);
                setUsuario(data);
            } catch (error) {
                setError("Error al cargar el usuario");
            }
        };
        fetchUsuario();
    }, [id]);

    return (
        <div>
            {/* Navbar */}
            <Navbar />

            {/* Contenido principal */}
            <div className="container mt-5">
                <div className="section-title text-center">
                    <h1>Detalles del Usuario</h1>
                </div>
                {error && (
                    <div className="alert alert-danger kreativa-alert">{error}</div>
                )}
                {usuario ? (
                    <div className="details-box p-4 mx-auto">
                        <p className="detalles-text">
                            <strong>Nombre:</strong> {usuario.nombre}
                        </p>
                        <p className="detalles-text">
                            <strong>Usuario:</strong> {usuario.usuario}
                        </p>
                        <p className="detalles-text">
                            <strong>Email:</strong> {usuario.email}
                        </p>
                        <p className="detalles-text">
                            <strong>Tipo de Usuario:</strong> {usuario.tipo_usuario}
                        </p>
                        <p className="detalles-text">
                            <strong>Estado:</strong> {usuario.estado}
                        </p>
                        <div className="d-flex justify-content-start mt-4">
                            <button
                                type="button"
                                className="thm-btn thm-btn-secondary"
                                onClick={() => navigate("/usuarios")}
                            >
                                Volver
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-center mt-4">Cargando...</p>
                )}
            </div>
        </div>
    );
};

export default VerUsuario;