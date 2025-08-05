import { useEffect, useState } from "react";
import axios from "axios";
import lodash from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faDownload,
    faEnvelope,
    faSort,
} from "@fortawesome/free-solid-svg-icons";
import ModalResponder from "../components/Reclutaciones/ModalResponder";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import TablaPaginacion from "../components/ui/TablaPaginacion";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

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

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [modalAction, setModalAction] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFormularios = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/reclutaciones`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setFormularios(response.data);
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
                console.error(
                    "Error al obtener los formularios de reclutamiento",
                    error
                );
            }
        };

        const fetchFormStatus = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/form-status`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setIsFormActive(response.data.active);
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
                console.error("Error al obtener estado del formulario");
            } finally {
                setLoading(false);
            }
        };

        fetchFormularios();
        fetchFormStatus();
    }, []);

    const confirmToggleFormStatus = () => {
        setModalAction(isFormActive ? "desactivar" : "activar");
        setShowConfirmModal(true);
    };

    const toggleFormStatus = async () => {
        const token = localStorage.getItem("token");

        try {
            setLoading(true);
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/form-status`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setIsFormActive(response.data.active);
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
            console.error("Error al cambiar estado del formulario");
        } finally {
            setLoading(false);
            setShowConfirmModal(false);
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
            <div className="main-container mx-auto">
                <div className="espacio-top-responsive"></div>
                <h1 className="mb-4">Formularios de Reclutamiento</h1>
                <div className="admin-panel">
                    <h2>Panel de Control</h2>
                    <div className="control-item d-flex align-items-center gap-3 flex-wrap mb-4">
                        <span>
                            ¡El formulario actualmente se encuentra{" "}
                            <strong
                                className={
                                    isFormActive
                                        ? "text-success"
                                        : "text-danger"
                                }
                            >
                                {isFormActive ? "activo" : "inactivo"}
                            </strong>
                            !
                        </span>
                        <button
                            onClick={confirmToggleFormStatus}
                            disabled={loading}
                            className={`thm-btn thm-btn-small ${isFormActive ? "btn-rojo" : "btn-verde"}`}
                        >
                            {loading
                                ? "Cargando..."
                                : isFormActive
                                  ? "Desactivar"
                                  : "Activar"}
                        </button>
                    </div>
                </div>

                <div className="div-table">
                    <Table className="main-table tabla-trabajo">
                        <Thead>
                            <Tr>
                                <Th className="col-nombre">Nombre</Th>
                                <Th className="col-correo">Correo</Th>
                                <Th className="col-telefono">Teléfono</Th>
                                <Th
                                    className="col-fecha"
                                    onClick={() => handleSort("fecha_envio")}
                                    style={{ cursor: "pointer" }}
                                >
                                    Fecha{" "}
                                    <span className="sort-icon">
                                        <FontAwesomeIcon icon={faSort} />
                                    </span>
                                </Th>
                                <Th className="col-acciones">Acciones</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {formulariosPaginados.length > 0 ? (
                                formulariosPaginados.map((form) => (
                                    <Tr key={form._id}>
                                        <Td className="col-nombre">
                                            {form.nombre} {form.apellido}
                                        </Td>
                                        <Td className="col-correo">
                                            {form.correo}
                                        </Td>
                                        <Td className="col-telfono">
                                            {form.telefono}
                                        </Td>
                                        <Td className="col-fecha">
                                            {new Date(
                                                form.fecha_envio
                                            ).toLocaleDateString()}
                                        </Td>
                                        <Td className="text-center col-acciones">
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
                                                        !form.file ||
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
                                        </Td>
                                    </Tr>
                                ))
                            ) : (
                                <Tr>
                                    <Td colSpan="5" className="text-center">
                                        No hay formularios disponibles
                                    </Td>
                                </Tr>
                            )}
                        </Tbody>
                    </Table>
                </div>

                {/* <div className="table-responsive-xxl">
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
                    <td>{new Date(form.fecha_envio).toLocaleDateString()}</td>
                    <td className="acciones">
                      <div className="botones-grupo">
                        <button
                          className="thm-btn thm-btn-small btn-amarillo"
                          onClick={() => handleDescargarCV(form)}
                          disabled={!form.file || form.file.length === 0}
                          title={
                            !form.files || form.file.length === 0
                              ? "No hay CV disponible"
                              : "Descargar CV"
                          }
                        >
                          <FontAwesomeIcon icon={faDownload} />
                        </button>
                        <button
                          className="thm-btn thm-btn-small btn-azul"
                          onClick={() => handleResponderFormulario(form)}
                        >
                          <FontAwesomeIcon icon={faEnvelope} />
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
        </div> */}

                <TablaPaginacion
                    totalItems={formularios.length}
                    itemsPorPagina={itemsPag}
                    paginaActual={pagActual}
                    onItemsPorPaginaChange={(cant) => {
                        setItemsPag(cant);
                        setPagActual(1);
                    }}
                    onPaginaChange={(pagina) => setPagActual(pagina)}
                />

                {mostrarResponderModal && (
                    <ModalResponder
                        form={formularioSeleccionado}
                        onClose={() => setMostrarResponderModal(false)}
                    />
                )}
            </div>

            <Modal
                show={showConfirmModal}
                onHide={() => setShowConfirmModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Acción</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Seguro que desea {modalAction} el formulario de
                    reclutamiento?
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="thm-btn thm-btn-small btn-gris mx-1"
                        onClick={() => setShowConfirmModal(false)}
                    >
                        Cancelar
                    </button>
                    <button
                        className="thm-btn thm-btn-small"
                        onClick={toggleFormStatus}
                    >
                        Sí
                    </button>
                </Modal.Footer>
            </Modal>
        </AdminLayout>
    );
};

export default RespuestasReclutaciones;
