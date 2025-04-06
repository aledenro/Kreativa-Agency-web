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
            faBell,
        } from "@fortawesome/free-solid-svg-icons";
        import { Table, Pagination, Form, Button, Modal } from "react-bootstrap";
        import AdminLayout from "../components/AdminLayout/AdminLayout";
        import { useNavigate } from "react-router-dom";
        import ModalVerIngreso from "../components/Ingresos/ModalVerIngreso";
        import ModalEditarIngreso from "../components/Ingresos/ModalEditarIngreso";
        import ModalCrearIngreso from "../components/Ingresos/ModalCrearIngreso";

        const ListadoIngresos = () => {
            // Datos principales
            const [ingresos, setIngresos] = useState([]);
            const [categories, setCategories] = useState([]);
            const [clientes, setClientes] = useState([]);

            const formatLocalDate = (date) => {
                const d = new Date(date);
                const year = d.getFullYear();
                const month = (d.getMonth() + 1).toString().padStart(2, "0");
                const day = d.getDate().toString().padStart(2, "0");
                return `${year}-${month}-${day}`;
            };

            // Filtros globales:
            const [filterEstadoPago, setFilterEstadoPago] = useState("Pendiente de pago");
            const [filterEstado, setFilterEstado] = useState("Activo");
            const [filterCliente, setFilterCliente] = useState("");
            const [filterFecha, setFilterFecha] = useState("");

            // Ordenamiento y paginación
            const [sortField, setSortField] = useState("fecha_creacion");
            const [sortOrder, setSortOrder] = useState("desc");
            const [itemsPag, setItemsPag] = useState(5);
            const [pagActual, setPagActual] = useState(1);

            // Estados para modales de contenido
            const [showModalVer, setShowModalVer] = useState(false);
            const [ingresoVer, setIngresoVer] = useState({});
            const [showModalEditar, setShowModalEditar] = useState(false);
            const [ingresoEditar, setIngresoEditar] = useState({});
            const [showModalCrear, setShowModalCrear] = useState(false);

            // Estados para modales de confirmación
            const [showConfirmToggle, setShowConfirmToggle] = useState(false);
            const [toggleIngreso, setToggleIngreso] = useState(null);

            const [showConfirmEditar, setShowConfirmEditar] = useState(false);
            const [editedIngresoData, setEditedIngresoData] = useState(null);

            const [showConfirmCrear, setShowConfirmCrear] = useState(false);

            const navigate = useNavigate();

            // Función para mapear el id de la categoría al nombre (Opción B)
            const getCategoryName = (catId) => {
                const cat = categories.find((c) => c._id.toString() === catId.toString());
                return cat ? cat.nombre : catId;
            };

            // Función para refrescar la lista de ingresos
            const fetchIngresos = useCallback(async () => {
                try {
                    const res = await axios.get("http://localhost:4000/api/ingresos");
                    setIngresos(res.data);
                } catch (error) {
                    console.error("Error fetching ingresos:", error.message);
                }
            }, []);

            useEffect(() => {
                const fetchCategories = async () => {
                    try {
                        const res = await axios.get("http://localhost:4000/api/servicios/categorias");
                        setCategories(res.data);
                    } catch (error) {
                        console.error("Error fetching categories:", error.message);
                    }
                };

                const fetchClientes = async () => {
                    try {
                        const token = localStorage.getItem("token");
                        const res = await axios.get("http://localhost:4000/api/usuarios", {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        setClientes(res.data);
                    } catch (error) {
                        console.error(`Error al obtener los clientes: ${error.message}`);
                    }
                };

                fetchIngresos();
                fetchCategories();
                fetchClientes();
            }, [fetchIngresos]);

            // Filtrado global:
            let ingresosFiltrados = ingresos;
            if (filterEstadoPago !== "" && filterEstadoPago !== "Todos") {
                ingresosFiltrados = ingresosFiltrados.filter(
                    (ingreso) => ingreso.estado === filterEstadoPago
                );
            }
            if (filterEstado !== "" && filterEstado !== "Todos") {
                ingresosFiltrados =
                    filterEstado === "Activo"
                        ? ingresosFiltrados.filter((ingreso) => ingreso.activo)
                        : ingresosFiltrados.filter((ingreso) => !ingreso.activo);
            }
            if (filterCliente !== "") {
                ingresosFiltrados = ingresosFiltrados.filter(
                    (ingreso) =>
                        ingreso.nombre_cliente.toLowerCase() === filterCliente.toLowerCase()
                );
            }

            if (filterFecha !== "") {
                ingresosFiltrados = ingresosFiltrados.filter((ingreso) => {
                    return formatLocalDate(ingreso.fecha) === filterFecha;
                });
            }

            const ingresosOrdenados =
                sortOrder === "asc"
                    ? ingresosFiltrados.sort((a, b) =>
                        lodash.get(a, sortField).toString().localeCompare(lodash.get(b, sortField).toString())
                    )
                    : ingresosFiltrados.sort((a, b) =>
                        lodash.get(b, sortField).toString().localeCompare(lodash.get(a, sortField).toString())
                    );

            const totalPaginas = Math.ceil(ingresosOrdenados.length / itemsPag);
            const ingresosPaginados = ingresosOrdenados.slice(
                (pagActual - 1) * itemsPag,
                pagActual * itemsPag
            );

            const cambiarPagina = (num) => {
                if (num >= 1 && num <= totalPaginas) setPagActual(num);
            };

            // Confirmación para activar/desactivar
            const handleToggleClick = (ingreso) => {
                setToggleIngreso(ingreso);
                setShowConfirmToggle(true);
            };

            const handleConfirmToggle = async () => {
                if (toggleIngreso) {
                    try {
                        const url = toggleIngreso.activo
                            ? `http://localhost:4000/api/ingresos/${toggleIngreso._id}/desactivar`
                            : `http://localhost:4000/api/ingresos/${toggleIngreso._id}/activar`;
                        await axios.put(url);
                        // Actualizamos el estado local sin refrescar desde el backend:
                        setIngresos((prev) =>
                            prev.map((i) =>
                                i._id === toggleIngreso._id ? { ...i, activo: !i.activo } : i
                            )
                        );
                        setShowConfirmToggle(false);
                        setToggleIngreso(null);
                    } catch (error) {
                        console.error("Error toggling activation:", error.message);
                    }
                }
            };

            // Para editar: se espera que ModalEditarIngreso invoque onSave con los datos editados
            const onSaveEdit = (data) => {
                setEditedIngresoData(data);
                setShowModalEditar(false);
                setShowConfirmEditar(true);
            };

            const handleConfirmEdit = async () => {
                try {
                    await axios.put(`http://localhost:4000/api/ingresos/${editedIngresoData._id}`, editedIngresoData);
                    setShowConfirmEditar(false);
                    setEditedIngresoData(null);
                    fetchIngresos();
                } catch (error) {
                    console.error("Error updating ingreso:", error.message);
                }
            };

            // Para crear: se espera que ModalCrearIngreso invoque onSave cuando se crea exitosamente
            const onSaveCrear = () => {
                setShowModalCrear(false);
                setShowConfirmCrear(true);
            };

            const handleConfirmCrear = () => {
                setShowConfirmCrear(false);
                fetchIngresos();
            };

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
                        {/* Espacio extra para evitar que el contenido quede detrás del navbar */}
                        <div style={{ height: "90px" }}></div>
                        {/* Encabezado */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h1>Gestión de Ingresos</h1>
                            <button className="thm-btn" onClick={() => setShowModalCrear(true)}>
                                <FontAwesomeIcon icon={faPlus} className="me-2" /> Nuevo Ingreso
                            </button>
                        </div>

                        {/* Filtros globales en dos columnas */}
                        <div className="row mb-3">
                            {/* Columna izquierda: Filtro por Cliente */}
                            <div className="col-md-4">
                                <Form.Group controlId="filterCliente">
                                    <Form.Label>Cliente:</Form.Label>
                                    <Form.Select
                                        value={filterCliente}
                                        onChange={(e) => {
                                            setFilterCliente(e.target.value);
                                            setPagActual(1);
                                        }}
                                        className="thm-btn"
                                    >
                                        <option value="">Todos</option>
                                        {clientes.map((cliente) => (
                                            <option key={cliente._id} value={cliente.nombre}>
                                                {cliente.nombre}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group controlId="filterFecha">
                                    <Form.Label>Fecha de Vencimiento:</Form.Label>
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
                            {/* Columna derecha: Filtros por Estado de Pago y Estado del Ingreso */}
                            <div className="col-md-4">
                                <Form.Group controlId="filterEstadoPago" className="mb-2">
                                    <Form.Label>Estado de Pago:</Form.Label>
                                    <Form.Select
                                        value={filterEstadoPago}
                                        onChange={(e) => {
                                            setFilterEstadoPago(e.target.value);
                                            setPagActual(1);
                                        }}
                                        className="thm-btn"
                                    >
                                        <option value="">Todos</option>
                                        <option value="Pendiente de pago">Pendiente de pago</option>
                                        <option value="Pagado">Pagado</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group controlId="filterEstado">
                                    <Form.Label>Estado del Ingreso:</Form.Label>
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
                            </div>
                        </div>

                        {/* Tabla de Ingresos */}
                        <div className="table-responsive">
                            <Table className="table kreativa-table">
                                <thead>
                                    <tr>
                                        <th style={{ cursor: "pointer" }} onClick={() => handleSort("fecha_creacion")}>
                                            Fecha Creación <FontAwesomeIcon icon={faSort} />
                                        </th>
                                        <th>Nombre Cliente</th>
                                        <th>Categoría</th>
                                        <th>Descripción</th>
                                        <th style={{ cursor: "pointer" }} onClick={() => handleSort("monto")}>
                                            Monto <FontAwesomeIcon icon={faSort} />
                                        </th>
                                        <th style={{ cursor: "pointer" }} onClick={() => handleSort("fecha")}>
                                            Fecha Vencimiento <FontAwesomeIcon icon={faSort} />
                                        </th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ingresosPaginados.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="text-center">
                                                No hay ingresos para mostrar.
                                            </td>
                                        </tr>
                                    ) : (
                                        ingresosPaginados.map((ingreso) => (
                                            <tr key={ingreso._id}>
                                                <td>{new Date(ingreso.fecha_creacion).toLocaleDateString()}</td>
                                                <td>{ingreso.nombre_cliente}</td>
                                                <td>{getCategoryName(ingreso.categoria)}</td>
                                                <td>{ingreso.descripcion}</td>
                                                <td>₡{ingreso.monto}</td>
                                                <td>{new Date(ingreso.fecha).toLocaleDateString()}</td>
                                                <td>{ingreso.estado}</td>
                                                <td>
                                                    <div className="botones-grupo" style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                                        {/* Primera fila: Ver detalle y Modificar */}
                                                        <div style={{ display: "flex", gap: "5px" }}>
                                                            <button
                                                                className="thm-btn thm-btn-small btn-amarillo"
                                                                onClick={() => {
                                                                    setIngresoVer(ingreso);
                                                                    setShowModalVer(true);
                                                                }}
                                                                title="Ver detalle"
                                                            >
                                                                <FontAwesomeIcon icon={faEye} />
                                                            </button>
                                                            <button
                                                                className="thm-btn thm-btn-small btn-azul"
                                                                onClick={() => {
                                                                    setIngresoEditar(ingreso);
                                                                    setShowModalEditar(true);
                                                                }}
                                                                title="Modificar"
                                                                disabled={!ingreso.activo  || ingreso.estado === "Pagado"}
                                                            >
                                                                <FontAwesomeIcon icon={faPencil} />
                                                            </button>
                                                        </div>
                                                        {/* Segunda fila: Notificar y Activar/Desactivar */}
                                                        <div style={{ display: "flex", gap: "5px" }}>
                                                            <button
                                                                className="thm-btn thm-btn-small btn-notificar"
                                                                onClick={() => {
                                                                    /* Funcionalidad de notificación por definir */
                                                                }}
                                                                title="Notificar"
                                                                disabled={!ingreso.activo}
                                                            >
                                                                <FontAwesomeIcon icon={faBell} />
                                                            </button>
                                                            <button
                                                                className={`thm-btn thm-btn-small ${ingreso.activo ? "btn-verde" : "btn-rojo"}`}
                                                                onClick={() => handleToggleClick(ingreso)}
                                                                title={ingreso.activo ? "Desactivar" : "Activar"  || ingreso.estado === "Pagado"}
                                                            >
                                                                <FontAwesomeIcon icon={ingreso.activo ? faToggleOn : faToggleOff} />
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

                        {/* Paginación inferior con select de ítems por página */}
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
                                <option value={ingresosOrdenados.length}>Todos</option>
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
                                disabled={pagActual === totalPaginas || totalPaginas === 0}
                            >
                                <FontAwesomeIcon icon={faCaretRight} />
                            </button>
                            <button
                                className="thm-btn btn-volver thm-btn-small me-2"
                                onClick={() => setPagActual(totalPaginas)}
                                disabled={pagActual === totalPaginas || totalPaginas === 0}
                            >
                                <FontAwesomeIcon icon={faForward} />
                            </button>
                        </div>
                    </div>

                    {/* Modal de confirmación para activar/desactivar */}
                    <Modal show={showConfirmToggle} onHide={() => setShowConfirmToggle(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirmar Acción</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {toggleIngreso && toggleIngreso.activo
                                ? "¿Está seguro de que desea desactivar este ingreso?"
                                : "¿Está seguro de que desea activar este ingreso?"}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowConfirmToggle(false)}>
                                Cancelar
                            </Button>
                            <Button variant="primary" onClick={handleConfirmToggle}>
                                Aceptar
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Modal de confirmación para editar */}
                    <Modal show={showConfirmEditar} onHide={() => setShowConfirmEditar(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirmar Edición</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>¿Está seguro que desea editar este ingreso?</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowConfirmEditar(false)}>
                                Cancelar
                            </Button>
                            <Button variant="primary" onClick={handleConfirmEdit}>
                                Aceptar
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Modal de confirmación para creación */}
                    <Modal show={showConfirmCrear} onHide={() => setShowConfirmCrear(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Ingreso Creado</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Ingreso creado exitosamente.</Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={handleConfirmCrear}>
                                Aceptar
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Componentes de contenido */}
                    <ModalVerIngreso
                        show={showModalVer}
                        handleClose={() => setShowModalVer(false)}
                        ingreso={ingresoVer}
                        categories={categories}
                    />
                    <ModalEditarIngreso
                        show={showModalEditar}
                        handleClose={() => setShowModalEditar(false)}
                        ingreso={ingresoEditar}
                        categories={categories}
                        onSave={onSaveEdit}
                    />
                    <ModalCrearIngreso
                        show={showModalCrear}
                        handleClose={() => setShowModalCrear(false)}
                        categories={categories}
                        onSave={onSaveCrear}
                    />
                </AdminLayout>
            );
        };

        export default ListadoIngresos;