import { useEffect, useState } from "react";
import axios from "axios";
import lodash from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faDownload,
    faEnvelope,
    faBackward,
    faCaretLeft,
    faCaretRight,
    faForward,
    faSort,
} from "@fortawesome/free-solid-svg-icons";
import ModalResponder from "../components/Reclutaciones/ModalResponder";
import AdminLayout from "../components/AdminLayout/AdminLayout";

const RespuestasReclutaciones = () => {
    const [formularios, setFormularios] = useState([]);
    const [formularioSeleccionado, setFormularioSeleccionado] = useState(null);
    const [mostrarResponderModal, setMostrarResponderModal] = useState(false);
    const [itemsPag, setItemsPag] = useState(5);
    const [pagActual, setPagActual] = useState(1);
    const [sortField, setSortField] = useState("fecha_envio");
    const [sortOrder, setSortOrder] = useState("desc");

    const [isFormActive, setIsFormActive] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFormularios = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:4000/api/reclutaciones"
                );
                setFormularios(response.data);
            } catch (error) {
                console.error(
                    "Error al obtener los formularios de reclutamiento:",
                    error
                );
            }
        };

        const fetchFormStatus = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:4000/api/form-status"
                );
                setIsFormActive(response.data.active);
            } catch (error) {
                console.error("Error al obtener estado del formulario:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFormularios();
        fetchFormStatus();
    }, []);

    const toggleFormStatus = async () => {
        try {
            setLoading(true);
            const response = await axios.put(
                "http://localhost:4000/api/form-status"
            );
            setIsFormActive(response.data.active);
        } catch (error) {
            console.error("Error al cambiar estado del formulario:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleResponderFormulario = (form) => {
        setFormularioSeleccionado(form);
        setMostrarResponderModal(true);
    };

    const handleDescargarCV = (form) => {
        if (form.file) {
            window.open(form.file, "_blank");
        } else if (
            form.files &&
            Array.isArray(form.files) &&
            form.files.length > 0
        ) {
        } else {
            console.error("Esta reclutación no incluyó CV", form);
            alert("Esta reclutación no incluyó CV");
        }
    };

    const formulariosOrdenados = [...formularios].sort((a, b) => {
        const valueA = lodash.get(a, sortField);
        const valueB = lodash.get(b, sortField);

        return sortOrder === "asc"
            ? new Date(valueA) - new Date(valueB)
            : new Date(valueB) - new Date(valueA);
    });

    const formulariosPaginados = formulariosOrdenados.slice(
        (pagActual - 1) * itemsPag,
        pagActual * itemsPag
    );

    const totalPags = Math.ceil(formularios.length / itemsPag);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    return (
        <AdminLayout>
            <div className="container mt-4">
                <div style={{ height: "90px" }}></div>
                <h1 className="mb-4">Formularios de Reclutamiento</h1>
                <div className="admin-panel">
                    <h2>Panel de Control</h2>
                    <div className="control-item">
                        <span>Formulario de Landing Page:</span>
                        <button
                            onClick={toggleFormStatus}
                            disabled={loading}
                            className={`my-3 thm-btn thm-btn-small ${isFormActive ? "btn-rojo" : "btn-verde"}`}
                        >
                            {loading
                                ? "Cargando..."
                                : isFormActive
                                  ? "Desactivar"
                                  : "Activar"}
                        </button>
                    </div>
                </div>
                <div className="table-responsive-xxl">
                    <table className="table kreativa-proyecto-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Teléfono</th>
                                <th
                                    onClick={() => handleSort("fecha_envio")}
                                    style={{ cursor: "pointer" }}
                                >
                                    Fecha <FontAwesomeIcon icon={faSort} />
                                </th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formulariosPaginados.length > 0 ? (
                                formulariosPaginados.map((form) => (
                                    <tr key={form._id}>
                                        <td>
                                            {form.nombre} {form.apellido}
                                        </td>
                                        <td>{form.correo}</td>
                                        <td>{form.telefono}</td>
                                        <td>
                                            {new Date(
                                                form.fecha_envio
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="acciones">
                                            <div className="botones-grupo">
                                                <button
                                                    className="thm-btn thm-btn-small btn-amarillo"
                                                    onClick={() =>
                                                        handleDescargarCV(form)
                                                    }
                                                    disabled={
                                                        !form.file ||
                                                        form.file.length === 0
                                                    }
                                                    title={
                                                        !form.files ||
                                                        form.file.length === 0
                                                            ? "No hay CV disponible"
                                                            : "Descargar CV"
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faDownload}
                                                    />
                                                </button>
                                                <button
                                                    className="thm-btn thm-btn-small btn-azul"
                                                    onClick={() =>
                                                        handleResponderFormulario(
                                                            form
                                                        )
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faEnvelope}
                                                    />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        No hay formularios disponibles
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="d-flex justify-content-center mt-4">
                    <select
                        className="form-select form-select-sm w-auto me-2"
                        onChange={(e) => {
                            setItemsPag(Number(e.target.value));
                            setPagActual(1);
                        }}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={formularios.length}>Todos</option>
                    </select>
                    <button
                        className={`thm-btn btn-volver thm-btn-small me-2`}
                        onClick={() => setPagActual(1)}
                        disabled={pagActual === 1}
                    >
                        <FontAwesomeIcon icon={faBackward} />
                    </button>
                    <button
                        className={`thm-btn btn-volver thm-btn-small me-2`}
                        onClick={() => setPagActual(pagActual - 1)}
                        disabled={pagActual === 1}
                    >
                        <FontAwesomeIcon icon={faCaretLeft} />
                    </button>
                    <span className="align-self-center mx-2">
                        Página {pagActual} de {totalPags || 1}
                    </span>
                    <button
                        className={`thm-btn btn-volver thm-btn-small me-2`}
                        onClick={() => setPagActual(pagActual + 1)}
                        disabled={pagActual === totalPags || totalPags === 0}
                    >
                        <FontAwesomeIcon icon={faCaretRight} />
                    </button>
                    <button
                        className={`thm-btn btn-volver thm-btn-small me-2`}
                        onClick={() => setPagActual(totalPags)}
                        disabled={pagActual === totalPags || totalPags === 0}
                    >
                        <FontAwesomeIcon icon={faForward} />
                    </button>
                </div>

                {mostrarResponderModal && (
                    <ModalResponder
                        form={formularioSeleccionado}
                        onClose={() => setMostrarResponderModal(false)}
                    />
                )}
            </div>
        </AdminLayout>
    );
};

export default RespuestasReclutaciones;
