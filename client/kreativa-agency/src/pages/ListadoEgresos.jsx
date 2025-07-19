import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import lodash from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSort,
    faEye,
    faPencil,
    faToggleOn,
    faToggleOff,
    faBackward,
    faCaretLeft,
    faCaretRight,
    faForward,
    faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Table, Form, Button, Modal } from "react-bootstrap";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import ModalVerEgreso from "../components/Egresos/ModalVerEgreso";
import ModalEditarEgreso from "../components/Egresos/ModalEditarEgreso";
import ModalCrearEgreso from "../components/Egresos/ModalCrearEgreso";
import TablaPaginacion from "../components/ui/TablaPaginacion";


const ListadoEgresos = () => {
    const [egresos, setEgresos] = useState([]);
    const fixedCategories = [
        "Salarios",
        "Software",
        "Servicios de contabilidad",
        "Servicios",
    ];
    const formatLocalDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, "0");
        const day = d.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    // Filtro para el flag activo/inactivo
    const [filterEstado, setFilterEstado] = useState("Activo");
    const [filterFecha, setFilterFecha] = useState("");
    const [filterCategoria, setFilterCategoria] = useState("Todos");

    // Filtro para el estado
    const [filterEgresoEstado, setFilterEgresoEstado] = useState("Pendiente");

    // Ordenamiento y paginación
    const [sortField, setSortField] = useState("fecha");
    const [sortOrder, setSortOrder] = useState("desc");
    const [itemsPag, setItemsPag] = useState(5);
    const [pagActual, setPagActual] = useState(1);

    // Estados para modales de contenido
    const [showModalVer, setShowModalVer] = useState(false);
    const [egresoVer, setEgresoVer] = useState({});
    const [showModalEditar, setShowModalEditar] = useState(false);
    const [egresoEditar, setEgresoEditar] = useState({});
    const [showModalCrear, setShowModalCrear] = useState(false);

    // Estados para modales de confirmación
    const [showConfirmToggle, setShowConfirmToggle] = useState(false);
    const [toggleEgreso, setToggleEgreso] = useState(null);
    const [showConfirmEditar, setShowConfirmEditar] = useState(false);
    const [showConfirmCrear, setShowConfirmCrear] = useState(false);

    const fetchEgresos = useCallback(async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/egresos`);
            setEgresos(res.data);
        } catch (error) {
            console.error("Error al obtener egresos:", error.message);
        }
    }, []);

    useEffect(() => {
        fetchEgresos();
    }, [fetchEgresos]);

    // Filtrado de egresos
    let egresosFiltrados = egresos;

    // Filtrar por activo/inactivo
    if (filterEstado !== "" && filterEstado !== "Todos") {
        egresosFiltrados =
            filterEstado === "Activo"
                ? egresosFiltrados.filter((e) => e.activo)
                : egresosFiltrados.filter((e) => !e.activo);
    }
    // Filtrar por fecha
    if (filterFecha !== "") {
        egresosFiltrados = egresosFiltrados.filter(
            (e) => formatLocalDate(e.fecha) === filterFecha
        );
    }
    // Filtrar por categoría
    if (filterCategoria !== "Todos") {
        egresosFiltrados = egresosFiltrados.filter(
            (e) => e.categoria === filterCategoria
        );
    }
    // Filtrar por estado textual
    if (filterEgresoEstado !== "Todos") {
        egresosFiltrados = egresosFiltrados.filter(
            (e) => e.estado === filterEgresoEstado
        );
    }

    const egresosOrdenados =
        sortOrder === "asc"
            ? egresosFiltrados.sort((a, b) =>
                  lodash
                      .get(a, sortField)
                      .toString()
                      .localeCompare(lodash.get(b, sortField).toString())
              )
            : egresosFiltrados.sort((a, b) =>
                  lodash
                      .get(b, sortField)
                      .toString()
                      .localeCompare(lodash.get(a, sortField).toString())
              );

    const totalPaginas = Math.ceil(egresosOrdenados.length / itemsPag);
    const egresosPaginados = egresosOrdenados.slice(
        (pagActual - 1) * itemsPag,
        pagActual * itemsPag
    );

    const cambiarPagina = (num) => {
        if (num >= 1 && num <= totalPaginas) setPagActual(num);
    };

    // Función para activar/desactivar egresos
    const handleToggleClick = (egreso) => {
        setToggleEgreso(egreso);
        setShowConfirmToggle(true);
    };

    const handleConfirmToggle = async () => {
        if (toggleEgreso) {
            try {
                const url = toggleEgreso.activo
                    ? `${import.meta.env.VITE_API_URL}/egresos/${toggleEgreso._id}/desactivar`
                    : `${import.meta.env.VITE_API_URL}/egresos/${toggleEgreso._id}/activar`;
                await axios.put(url);
                setEgresos((prev) =>
                    prev.map((e) =>
                        e._id === toggleEgreso._id
                            ? { ...e, activo: !e.activo }
                            : e
                    )
                );
                setShowConfirmToggle(false);
                setToggleEgreso(null);
            } catch (error) {
                console.error(
                    "Error al cambiar estado de egreso:",
                    error.message
                );
            }
        }
    };

    // Al editar
    const onSaveEdit = (data) => {
        setShowModalEditar(false);
        setShowConfirmEditar(true);
        fetchEgresos();
    };

    // Al crear
    const onSaveCrear = () => {
        setShowModalCrear(false);
        setShowConfirmCrear(true);
        fetchEgresos();
    };

    const handleConfirmEditar = () => {
        setShowConfirmEditar(false);
    };

    const handleConfirmCrear = () => {
        setShowConfirmCrear(false);
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    // getCategoryName retorna directamente el valor de las categorias
    const getCategoryName = (cat) => cat;

    return (
        <AdminLayout>
            <div className="container mt-4">
                {/* Espacio para evitar que el contenido quede detrás del navbar */}
                <div style={{ height: "90px" }}></div>
                {/* Encabezado */}
                <div
                    className="d-flex justify-content-between align-items-center mb-4"
                    style={{ paddingRight: "80px" }}
                >
                    <h1>Gestión de Egresos</h1>
                    <button
                        className="thm-btn"
                        onClick={() => setShowModalCrear(true)}
                    >
                        <FontAwesomeIcon icon={faPlus} className="me-2" /> Nuevo
                        Egreso
                    </button>
                </div>

                {/* Filtros en dos columnas */}
                <div className="row mb-3">
                    {/* Columna izquierda: Fecha y Categoría */}
                    <div className="col-md-4">
                        <Form.Group controlId="filterCategoria">
                            <Form.Label>Categoría:</Form.Label>
                            <Form.Select
                                value={filterCategoria}
                                onChange={(e) => {
                                    setFilterCategoria(e.target.value);
                                    setPagActual(1);
                                }}
                                className="thm-btn"
                            >
                                <option value="Todos">Todos</option>
                                {fixedCategories.map((cat, index) => (
                                    <option key={index} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="filterFecha">
                            <Form.Label>Fecha:</Form.Label>
                            <Form.Control
                                type="date"
                                value={filterFecha}
                                onChange={(e) => {
                                    setFilterFecha(e.target.value);
                                    setPagActual(1);
                                }}
                                className="thm-btn"
                            />
                        </Form.Group>
                    </div>
                    {/* Columna derecha: Activo/Inactivo y Estado */}
                    <div className="col-md-3">
                        <Form.Group
                            controlId="filterEstado"
                            className="mb-4"
                            style={{ paddingRight: "80px" }}
                        >
                            <Form.Label>Activo/Inactivo:</Form.Label>
                            <Form.Select
                                value={filterEstado}
                                onChange={(e) => {
                                    setFilterEstado(e.target.value);
                                    setPagActual(1);
                                }}
                                className="thm-btn"
                            >
                                <option value="Todos">Todos</option>
                                <option value="Activo">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group
                            controlId="filterEgresoEstado"
                            style={{ paddingRight: "80px" }}
                        >
                            <Form.Label>Estado de Pago:</Form.Label>
                            <Form.Select
                                value={filterEgresoEstado}
                                onChange={(e) => {
                                    setFilterEgresoEstado(e.target.value);
                                    setPagActual(1);
                                }}
                                className="thm-btn"
                            >
                                <option value="Todos">Todos</option>
                                <option value="Pendiente">Pendiente</option>
                                <option value="Aprobado">Aprobado</option>
                                <option value="Rechazado">Rechazado</option>
                            </Form.Select>
                        </Form.Group>
                    </div>
                </div>

                {/* Tabla de egresos */}
                <div className="table-responsive">
                    <Table className="table kreativa-proyecto-table">
                        <thead>
                            <tr>
                                <th
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleSort("fecha")}
                                >
                                    Fecha <FontAwesomeIcon icon={faSort} />
                                </th>
                                <th
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleSort("monto")}
                                >
                                    Monto <FontAwesomeIcon icon={faSort} />
                                </th>
                                <th>Categoría</th>
                                <th>Descripción</th>
                                <th>Proveedor</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {egresosPaginados.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center">
                                        No hay egresos para mostrar.
                                    </td>
                                </tr>
                            ) : (
                                egresosPaginados.map((egreso) => (
                                    <tr key={egreso._id}>
                                        <td>
                                            {new Date(
                                                egreso.fecha
                                            ).toLocaleDateString()}
                                        </td>
                                        <td>₡{egreso.monto}</td>
                                        <td>
                                            {getCategoryName(egreso.categoria)}
                                        </td>
                                        <td>{egreso.descripcion}</td>
                                        <td>{egreso.proveedor}</td>
                                        <td>{egreso.estado}</td>
                                        <td>
                                            <div
                                                className="botones-grupo"
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "5px",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        gap: "5px",
                                                    }}
                                                >
                                                    <button
                                                        className="thm-btn thm-btn-small btn-amarillo"
                                                        onClick={() => {
                                                            setEgresoVer(
                                                                egreso
                                                            );
                                                            setShowModalVer(
                                                                true
                                                            );
                                                        }}
                                                        title="Ver detalle"
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faEye}
                                                        />
                                                    </button>
                                                    <button
                                                        className="thm-btn thm-btn-small btn-azul"
                                                        onClick={() => {
                                                            setEgresoEditar(
                                                                egreso
                                                            );
                                                            setShowModalEditar(
                                                                true
                                                            );
                                                        }}
                                                        title="Modificar"
                                                        disabled={
                                                            !egreso.activo
                                                        }
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faPencil}
                                                        />
                                                    </button>
                                                </div>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        gap: "5px",
                                                    }}
                                                >
                                                    <button
                                                        className={`thm-btn thm-btn-small ${egreso.activo ? "btn-verde" : "btn-rojo"}`}
                                                        onClick={() =>
                                                            handleToggleClick(
                                                                egreso
                                                            )
                                                        }
                                                        title={
                                                            egreso.activo
                                                                ? "Desactivar"
                                                                : "Activar"
                                                        }
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={
                                                                egreso.activo
                                                                    ? faToggleOn
                                                                    : faToggleOff
                                                            }
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </div>

                <TablaPaginacion
                    totalItems={egresosOrdenados.length}
                    itemsPorPagina={itemsPag}
                    paginaActual={pagActual}
                    onItemsPorPaginaChange={(cant) => {
                        setItemsPag(cant);
                        setPagActual(1);
                    }}
                    onPaginaChange={(pagina) => setPagActual(pagina)}
                />
                {/* Paginación
                <div className="d-flex justify-content-center mt-4">
                    <select
                        className="form-select form-select-sm w-auto me-2"
                        onChange={(e) => {
                            setItemsPag(Number(e.target.value));
                            setPagActual(1);
                        }}
                        value={itemsPag}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={egresosOrdenados.length}>Todos</option>
                    </select>
                    <button
                        className="thm-btn btn-volver thm-btn-small me-2"
                        onClick={() => setPagActual(1)}
                        disabled={pagActual === 1}
                    >
                        <FontAwesomeIcon icon={faBackward} />
                    </button>
                    <button
                        className="thm-btn btn-volver thm-btn-small me-2"
                        onClick={() => setPagActual(pagActual - 1)}
                        disabled={pagActual === 1}
                    >
                        <FontAwesomeIcon icon={faCaretLeft} />
                    </button>
                    <span className="align-self-center mx-2">
                        Página {pagActual} de {totalPaginas || 1}
                    </span>
                    <button
                        className="thm-btn btn-volver thm-btn-small me-2"
                        onClick={() => setPagActual(pagActual + 1)}
                        disabled={
                            pagActual === totalPaginas || totalPaginas === 0
                        }
                    >
                        <FontAwesomeIcon icon={faCaretRight} />
                    </button>
                    <button
                        className="thm-btn btn-volver thm-btn-small me-2"
                        onClick={() => setPagActual(totalPaginas)}
                        disabled={
                            pagActual === totalPaginas || totalPaginas === 0
                        }
                    >
                        <FontAwesomeIcon icon={faForward} />
                    </button>
                </div> */}
            </div>

            {/* Modal de confirmación para activar/desactivar */}
            <Modal
                show={showConfirmToggle}
                onHide={() => setShowConfirmToggle(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Acción</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {toggleEgreso && toggleEgreso.activo
                        ? "¿Está seguro de que desea desactivar este egreso?"
                        : "¿Está seguro de que desea activar este egreso?"}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowConfirmToggle(false)}
                    >
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleConfirmToggle}>
                        Aceptar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de confirmación para edición */}
            <Modal
                show={showConfirmEditar}
                onHide={() => setShowConfirmEditar(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Egreso Editado</Modal.Title>
                </Modal.Header>
                <Modal.Body>Egreso actualizado exitosamente.</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleConfirmEditar}>
                        Aceptar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Componentes de contenido */}
            <ModalVerEgreso
                show={showModalVer}
                handleClose={() => setShowModalVer(false)}
                egreso={egresoVer}
            />
            <ModalEditarEgreso
                show={showModalEditar}
                handleClose={() => setShowModalEditar(false)}
                egreso={egresoEditar}
                onSave={onSaveEdit}
            />
            <ModalCrearEgreso
                show={showModalCrear}
                handleClose={() => setShowModalCrear(false)}
                onSave={onSaveCrear}
            />
        </AdminLayout>
    );
};

export default ListadoEgresos;
