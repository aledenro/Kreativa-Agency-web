import "../App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import { CalendarCheck } from "lucide-react";

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

    // ✅ Función global para cambiar estado de PTO
    window.toggleEstadoPTO = async (ptoId, estadoActual, empleadoId, nombre) => {
        const token = localStorage.getItem("token");
        const nuevoEstado = estadoActual === "aprobado" ? "pendiente" : "aprobado";

        const confirm = await Swal.fire({
            title: `¿Cambiar estado?`,
            text: `¿Deseas cambiar el estado a "${nuevoEstado}"?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#ff0072",
        });

        if (!confirm.isConfirmed) return;

        try {
            await axios.patch(`http://localhost:4000/api/pto/${ptoId}`, { estado: nuevoEstado }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Swal.fire({
                title: "Estado actualizado",
                text: `El PTO fue marcado como ${nuevoEstado}.`,
                icon: "success",
                confirmButtonColor: "#ff0072",
            });

            verDetallesPTO(empleadoId, nombre); // Recargar tabla modal
        } catch (error) {
            console.error("Error al cambiar estado:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudo cambiar el estado.",
                icon: "error",
                confirmButtonColor: "#ff0072",
            });
        }
    };

    // ✅ Mostrar modal con tabla
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

            let html = `<table class="verpto-modal-table"><thead><tr>
                <th>Fecha de Inicio</th><th>Fecha de Fin</th><th>Comentario</th><th>Estado</th><th>Acción</th>
              </tr></thead><tbody>`;

            ptoList.forEach((pto) => {
                const estado = pto.estado.toLowerCase();
                const btnText = estado === "pendiente" ? "Aprobar" : "Desaprobar";

                html += `<tr>
                    <td>${new Date(pto.fecha_inicio).toLocaleDateString()}</td>
                    <td>${new Date(pto.fecha_fin).toLocaleDateString()}</td>
                    <td>${pto.comentario || "Sin comentario"}</td>
                    <td class="estado-${estado}">${pto.estado}</td>
                    <td>
                        <button class="aprobar-pto-btn" onclick="toggleEstadoPTO('${pto._id}', '${estado}', '${empleadoId}', '${nombre}')">
                            ${btnText}
                        </button>
                    </td>
                </tr>`;
            });

            html += "</tbody></table>";

            Swal.fire({
                title: `Solicitudes de PTO de ${nombre}`,
                html: html,
                width: "90%",
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
        <AdminLayout>
            <div className="verpto-wrapper">
                <div className="verpto-content">
                    <div className="verpto-title-wrapper">
                        <div className="verpto-icon-wrapper">
                            <CalendarCheck size={60} color="#ff0072" strokeWidth={2.5} />
                        </div>
                        <h1 className="verpto-title">Administrar PTO de Empleados</h1>
                    </div>

                    {loading ? (
                        <p className="text-center">Cargando...</p>
                    ) : error ? (
                        <p className="text-danger text-center">{error}</p>
                    ) : empleados.length === 0 ? (
                        <p className="text-center text-muted">No hay empleados registrados.</p>
                    ) : (
                        <div className="verpto-table-responsive">
                            <table className="verpto-table">
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
                                                    className="verpto-btn"
                                                    onClick={() => verDetallesPTO(empleado._id, empleado.nombre)}
                                                >
                                                    Ver PTO
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="text-center mt-4">
                        <button className="verpto-btn verpto-volver" onClick={() => navigate("/dashboard")}>
                            Volver
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default VerPTOEmpleados;