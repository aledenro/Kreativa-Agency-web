import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";

const VerUsuario = () => {
    const { id } = useParams();
    const [usuario, setUsuario] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("No hay token disponible");
                    setLoading(false);
                    return;
                }

                const { data } = await axios.get(`http://localhost:4000/api/usuarios/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setUsuario(data);
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener usuario:", error.response?.data || error);
                setError("Error al cargar el usuario");
                setLoading(false);
            }
        };

        fetchUsuario();
    }, [id]);

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <h1>Detalles del Usuario</h1>
                {error && <div className="alert alert-danger">{error}</div>}
                {loading ? <p>Cargando...</p> : (
                    usuario ? (
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{usuario.nombre}</h5>
                                <p><strong>Usuario:</strong> {usuario.usuario}</p>
                                <p><strong>Cédula:</strong> {usuario.cedula}</p>
                                <p><strong>Email:</strong> {usuario.email}</p>
                                <p><strong>Tipo de Usuario:</strong> {usuario.tipo_usuario}</p>
                                <p><strong>Estado:</strong> {usuario.estado}</p>
                            </div>
                        </div>
                    ) : <p>No se encontró información del usuario.</p>
                )}
            </div>
        </div>
    );
};

export default VerUsuario;