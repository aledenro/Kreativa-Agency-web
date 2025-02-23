import "../App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Swal from "sweetalert2";

const VerPerfil = () => {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPerfil = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    Swal.fire({
                        title: "Error",
                        text: "No hay token disponible. Inicia sesión nuevamente.",
                        icon: "error",
                        confirmButtonColor: "#ff0072",
                    });
                    navigate("/login");
                    return;
                }

                // Decodificar el token para obtener el ID del usuario autenticado
                const decoded = jwtDecode(token);
                console.log("Usuario logueado:", decoded);

                // Llamar al backend con el ID del usuario autenticado
                const response = await axios.get(`http://localhost:4000/api/usuarios/${decoded.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setUsuario(response.data);
            } catch (error) {
                console.error("Error al obtener el perfil:", error);
                setError("Hubo un problema al obtener la información del perfil.");
            } finally {
                setLoading(false);
            }
        };

        fetchPerfil();
    }, [navigate]);

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <div className="section-title text-center">
                    <h1 className="kreativa-title">Mi Perfil</h1>
                </div>

                {loading ? (
                    <p className="text-center">Cargando...</p>
                ) : error ? (
                    <p className="text-danger text-center">{error}</p>
                ) : (
                    <div className="perfil-container mx-auto">
                        <div className="perfil-card">
                            <h2>{usuario.nombre}</h2>
                            <p><strong>Usuario:</strong> {usuario.usuario}</p>
                            <p><strong>Email:</strong> {usuario.email}</p>
                            <p><strong>Cédula:</strong> {usuario.cedula}</p>
                            <p><strong>Rol:</strong> {usuario.tipo_usuario}</p>
                            <p><strong>Estado:</strong> {usuario.estado}</p>
                            <p><strong>Fecha de Registro:</strong> {new Date(usuario.fechaRegistro).toLocaleDateString()}</p>
                        </div>
                    </div>
                )}

                <div className="text-center mt-4">
                    <button className="thm-btn" onClick={() => navigate("/dashboard")}>Volver</button>
                </div>
            </div>
        </div>
    );
};

export default VerPerfil;