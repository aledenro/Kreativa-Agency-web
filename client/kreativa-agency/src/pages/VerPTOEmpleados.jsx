import "../App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Swal from "sweetalert2";

const VerPTOEmpleados = () => {
    const navigate = useNavigate();
    const [empleados, setEmpleados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEmpleados = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    Swal.fire({
                        title: "Error",
                        text: "No hay token disponible. Inicia sesión nuevamente.",
                        icon: "error",
                        confirmButtonColor: "#ff0072",
                    });
                    return;
                }

                const response = await axios.get("http://localhost:4000/api/usuarios", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setEmpleados(response.data);
            } catch (error) {
                console.error("Error al obtener empleados:", error);
                setError("Hubo un problema al cargar la lista de empleados.");
            } finally {
                setLoading(false);
            }
        };

        fetchEmpleados();
    }, []);

    const verDetallesPTO = async (empleadoId, nombre) => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(`http://localhost:4000/api/pto/${empleadoId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const ptoList = response.data;

            if (!Array.isArray(ptoList) || ptoList.length === 0) {
                Swal.fire({
                    title: "Sin registros",
                    text: `${nombre} no tiene solicitudes de PTO.`,
                    icon: "info",
                    confirmButtonColor: "#ff0072",
                });
                return;
            }

            let html = `<table class="kreativa-table no-hover"><thead><tr>
                        <th>Fecha de Inicio</th><th>Fecha de Fin</th><th>Comentario</th><th>Estado</th>
                        </tr></thead><tbody>`;

            ptoList.forEach((pto) => {
                html += `<tr>
                        <td>${new Date(pto.fecha_inicio).toLocaleDateString()}</td>
                        <td>${new Date(pto.fecha_fin).toLocaleDateString()}</td>
                        <td>${pto.comentario || "Sin comentario"}</td>
                        <td class="estado-${pto.estado.toLowerCase()}">${pto.estado}</td>
                    </tr>`;
            });

            html += "</tbody></table>";

            Swal.fire({
                title: `Solicitudes de PTO de ${nombre}`,
                html: html,
                width: "80%",
                confirmButtonColor: "#ff0072",
            });

        } catch (error) {
            console.error("Error al obtener PTO:", error);
            Swal.fire({
                title: "Sin registros",
                text: `${nombre} no tiene solicitudes de PTO.`,
                icon: "info",
                confirmButtonColor: "#ff0072",
            });
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <div className="section-title text-center">
                    <h1 className="kreativa-title">Administrar PTO de Empleados</h1>
                </div>

                {loading ? (
                    <p className="text-center">Cargando...</p>
                ) : error ? (
                    <p className="text-danger text-center">{error}</p>
                ) : empleados.length === 0 ? (
                    <p className="text-center text-muted">No hay empleados registrados.</p>
                ) : (
                    <table className="kreativa-table no-hover">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {empleados.map((empleado) => (
                                <tr key={empleado._id}>
                                    <td>{empleado.nombre}</td>
                                    <td>{empleado.email}</td>
                                    <td>{empleado.tipo_usuario}</td>
                                    <td>
                                        <button
                                            className="thm-btn"
                                            onClick={() => verDetallesPTO(empleado._id, empleado.nombre)}
                                        >
                                            Ver PTO
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <div className="text-center mt-4">
                    <button className="thm-btn" onClick={() => navigate("/dashboard")}>Volver</button>
                </div>
            </div>
        </div>
    );
};

export default VerPTOEmpleados;