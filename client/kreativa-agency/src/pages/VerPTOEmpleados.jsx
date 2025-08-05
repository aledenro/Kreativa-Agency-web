import "../App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import TablaPaginacion from "../components/ui/TablaPaginacion";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";

const VerPTOEmpleados = () => {
    const navigate = useNavigate();
    const [empleados, setEmpleados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [itemsPag, setItemsPag] = useState(5);
    const [pagActual, setPagActual] = useState(1);
    const [sortField, setSortField] = useState("nombre");
    const [sortOrder, setSortOrder] = useState("asc");

    useEffect(() => {
        const fetchEmpleados = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/error", {
                        state: {
                            errorCode: 401,
                            mensaje: "Debe iniciar sesión para continuar.",
                        },
                    });
                }

                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/usuarios`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                setEmpleados(response.data);
            } catch (error) {
                if (error.status === 401) {
                    navigate("/error", {
                        state: {
                            errorCode: 401,
                            mensaje:
                                "Debe volver a iniciar sesión para continuar.",
                        },
                    });
                    return;
                }
                console.error("Error al obtener empleados");
                setError("Hubo un problema al cargar la lista de empleados.");
            } finally {
                setLoading(false);
            }
        };

        fetchEmpleados();
    }, []);

    const empleadosOrdenados = [...empleados].sort((a, b) => {
        const valueA = a[sortField]?.toLowerCase?.() || a[sortField];
        const valueB = b[sortField]?.toLowerCase?.() || b[sortField];

        if (typeof valueA === "string" && typeof valueB === "string") {
            return sortOrder === "asc"
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
        }
        return sortOrder === "asc"
            ? valueA > valueB
                ? 1
                : -1
            : valueB > valueA
              ? 1
              : -1;
    });

    const empleadosPaginados = empleadosOrdenados.slice(
        (pagActual - 1) * itemsPag,
        pagActual * itemsPag
    );

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    // Función global de cambio de estado PTO
    window.toggleEstadoPTO = async (
        ptoId,
        estadoActual,
        empleadoId,
        nombre
    ) => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/error", {
                state: {
                    errorCode: 401,
                    mensaje: "Acceso no autorizado.",
                },
            });
            return;
        }

        const nuevoEstado =
            estadoActual === "aprobado" ? "pendiente" : "aprobado";

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
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/pto/${ptoId}`,
                { estado: nuevoEstado },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            Swal.fire({
                title: "Estado actualizado",
                text: `El PTO fue marcado como ${nuevoEstado}.`,
                icon: "success",
                confirmButtonColor: "#ff0072",
            });

            verDetallesPTO(empleadoId, nombre); // Recargar tabla modal
        } catch (error) {
            if (error.status === 401) {
                localStorage.clear();
                navigate("/error", {
                    state: {
                        errorCode: 401,
                        mensaje: "Debe volver a iniciar sesión para continuar.",
                    },
                });

                return;
            }
            console.error("Error al cambiar estado");
            Swal.fire({
                title: "Error",
                text: "No se pudo cambiar el estado.",
                icon: "error",
                confirmButtonColor: "#ff0072",
            });
        }
    };

    const verDetallesPTO = async (empleadoId, nombre) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/error", {
                    state: {
                        errorCode: 401,
                        mensaje: "Debe iniciar sesión para continuar.",
                    },
                });
            }

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/pto/${empleadoId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

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
                const btnText =
                    estado === "pendiente" ? "Aprobar" : "Desaprobar";

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
            if (error.status === 401) {
                localStorage.clear();
                navigate("/error", {
                    state: {
                        errorCode: 401,
                        mensaje: "Debe volver a iniciar sesión para continuar.",
                    },
                });

                return;
            }
            console.error("Error al obtener PTO");
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
            <div className="main-container mx-auto">
                <div className="espacio-top-responsive"></div>
                <h1 className="mb-4">Administrar PTO de Empleados</h1>
                <div className="div-table">
                    <Table className="main-table">
                        <Thead>
                            <Tr>
                                <Th
                                    onClick={() => handleSort("nombre")}
                                    className="col-nombre"
                                >
                                    Nombre{" "}
                                    <span className="sort-icon">
                                        <FontAwesomeIcon icon={faSort} />
                                    </span>
                                </Th>
                                <Th className="col-email">Email</Th>
                                <Th
                                    onClick={() => handleSort("tipo_usuario")}
                                    className="col-rol"
                                >
                                    Rol{" "}
                                    <span className="sort-icon">
                                        <FontAwesomeIcon icon={faSort} />
                                    </span>
                                </Th>
                                <Th className="col-acciones">Acción</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {empleadosPaginados.map((empleado) => (
                                <Tr key={empleado._id}>
                                    <Td className="col-nombre">
                                        {empleado.nombre}
                                    </Td>
                                    <Td className="col-email">
                                        {empleado.email}
                                    </Td>
                                    <Td className="col-rol">
                                        {empleado.tipo_usuario}
                                    </Td>
                                    <Td className="text-center col-acciones">
                                        <div className="botones-grupo">
                                            <button
                                                className="thm-btn thm-btn-small btn-amarillo"
                                                onClick={() =>
                                                    verDetallesPTO(
                                                        empleado._id,
                                                        empleado.nombre
                                                    )
                                                }
                                            >
                                                Ver PTO
                                            </button>
                                        </div>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </div>

                <TablaPaginacion
                    totalItems={empleados.length}
                    itemsPorPagina={itemsPag}
                    paginaActual={pagActual}
                    onItemsPorPaginaChange={(cant) => {
                        setItemsPag(cant);
                        setPagActual(1);
                    }}
                    onPaginaChange={(pagina) => setPagActual(pagina)}
                />

                <div className="text-center mt-4">
                    <button
                        className="thm-btn thm-btn-small btn-gris"
                        onClick={() => navigate("/dashboard")}
                    >
                        Volver
                    </button>
                </div>
            </div>
            {/* <div className="verpto-wrapper">
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
            </div> */}
        </AdminLayout>
    );
};

export default VerPTOEmpleados;
