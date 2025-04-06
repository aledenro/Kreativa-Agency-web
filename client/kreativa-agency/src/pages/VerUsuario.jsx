import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import { User } from "lucide-react";

const VerUsuario = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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
        <AdminLayout>
            <div className="kreativa-form-wrapper">
                <div className="kreativa-card">
                    <div className="text-center mb-3">
                        <User size={80} color="#ff0072" strokeWidth={2.5} />
                    </div>
                    <h2 className="kreativa-form-title">Detalles del Usuario</h2>

                    {error && (
                        <div className="alert alert-danger kreativa-alert text-center">{error}</div>
                    )}

                    {loading ? (
                        <p className="text-center">Cargando...</p>
                    ) : usuario ? (
                        <>
                            <div className="kreativa-user-details">
                                <p><strong>Nombre:</strong> {usuario.nombre}</p>
                                <hr className="kreativa-divider" />

                                <p><strong>Usuario:</strong> {usuario.usuario}</p>
                                <hr className="kreativa-divider" />

                                <p><strong>Cédula:</strong> {usuario.cedula}</p>
                                <hr className="kreativa-divider" />

                                <p><strong>Email:</strong> {usuario.email}</p>
                                <hr className="kreativa-divider" />

                                <p><strong>Tipo de Usuario:</strong> {usuario.tipo_usuario}</p>
                                <hr className="kreativa-divider" />

                                <p><strong>Estado:</strong> {usuario.estado}</p>
                            </div>

                            <div className="text-center mt-4">
                                <button
                                    type="button"
                                    className="thm-btn thm-btn-secondary kreativa-btn-volver"
                                    onClick={() => navigate("/usuarios")}
                                >
                                    Volver
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="text-center">No se encontró información del usuario.</p>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default VerUsuario;