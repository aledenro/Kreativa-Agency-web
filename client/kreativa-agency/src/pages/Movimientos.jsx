import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Table } from "react-bootstrap";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import "../AdminPanel.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEye,
} from "@fortawesome/free-solid-svg-icons";

// Importamos los modales para ver Ingreso y Egreso
import ModalVerIngreso from "../components/Ingresos/ModalVerIngreso";
import ModalVerEgreso from "../components/Egresos/ModalVerEgreso";

const Movimientos = () => {
    // Estados para filtros
    const [filterType, setFilterType] = useState("fecha");
    const [fecha, setFecha] = useState("");
    const [anio, setAnio] = useState(new Date().getFullYear());
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");

    // Estado para los movimientos obtenidos
    const [movimientos, setMovimientos] = useState([]);

    // Estado para las categorías (para mapear el ID en movimientos de ingreso)
    const [categories, setCategories] = useState([]);

    // Estados para controlar los modales y el registro seleccionado
    const [registroSeleccionado, setRegistroSeleccionado] = useState(null);
    const [showModalVerIngreso, setShowModalVerIngreso] = useState(false);
    const [showModalVerEgreso, setShowModalVerEgreso] = useState(false);

    // Función para obtener movimientos según el filtro seleccionado
    const fetchMovimientos = () => {
        let url = "http://localhost:4000/api/movimientos?";
        if (filterType === "fecha") {
            if (fecha) url += `fecha=${fecha}`;
        } else if (filterType === "anio") {
            url += `anio=${anio}`;
        } else if (filterType === "rango") {
            if (fechaInicio && fechaFin) {
                url += `fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
            }
        }
        axios
            .get(url)
            .then((response) => {
                setMovimientos(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener movimientos:", error.message);
            });
    };

    // Cargar movimientos al montar el componente
    useEffect(() => {
        fetchMovimientos();
    }, []);

    // Cargar las categorías (para mapear el ID en ingresos)
    useEffect(() => {
        axios
            .get("http://localhost:4000/api/servicios/categorias")
            .then((res) => {
                setCategories(res.data);
            })
            .catch((error) => {
                console.error("Error al obtener categorías:", error.message);
            });
    }, []);

    // Helper para mapear el ID de categoría al nombre
    const getCategoryName = (catId) => {
        const cat = categories.find(
            (c) => c._id.toString() === catId.toString()
        );
        return cat ? cat.nombre : catId;
    };

    // Función para determinar el detalle a mostrar en el modal.
    // Si existe "datosNuevos" en mov.detalle, se usará ese objeto; de lo contrario, se usará mov.detalle.
    const obtenerDetalleCompleto = (mov) => {
        return (mov.detalle && mov.detalle.datosNuevos) || mov.detalle || {};
    };

    // Función para renderizar el resumen de detalles en la tabla
    const renderDetalle = (mov) => {
        const data = obtenerDetalleCompleto(mov);
        if (mov.entidad === "ingreso") {
            return (
                <div>
                    <div>
                        <strong>Cliente:</strong>{" "}
                        {data.nombre_cliente ? data.nombre_cliente : "Sin cliente"}
                    </div>
                    <div>
                        <strong>Descripción:</strong>{" "}
                        {data.descripcion ? data.descripcion : "Sin descripción"}
                    </div>
                    <div>
                        <strong>Última Modificación:</strong>{" "}
                        {data.ultima_modificacion
                            ? new Date(data.ultima_modificacion).toLocaleString()
                            : "Sin fecha"}
                    </div>
                </div>
            );
        }
        if (mov.entidad === "egreso") {
            return (
                <div>
                    <div>
                        <strong>Descripción:</strong>{" "}
                        {data.descripcion ? data.descripcion : "Sin descripción"}
                    </div>
                    <div>
                        <strong>Última Modificación:</strong>{" "}
                        {data.ultima_modificacion
                            ? new Date(data.ultima_modificacion).toLocaleString()
                            : "Sin fecha"}
                    </div>
                </div>
            );
        }
        return <div>Sin detalle</div>;
    };

    // Función que se ejecuta al hacer clic en "Ver" en la tabla de movimientos.
    // Se consulta el registro completo utilizando el idRegistro.
    const handleVer = (mov) => {
        if (!mov.idRegistro) {
            console.error("El movimiento no tiene idRegistro");
            return;
        }
        if (mov.entidad === "ingreso") {
            axios
                .get(`http://localhost:4000/api/ingresos/${mov.idRegistro}`)
                .then((response) => {
                    setRegistroSeleccionado(response.data);
                    setShowModalVerIngreso(true);
                })
                .catch((error) => {
                    console.error("Error al obtener el ingreso:", error.message);
                });
        } else if (mov.entidad === "egreso") {
            axios
                .get(`http://localhost:4000/api/egresos/${mov.idRegistro}`)
                .then((response) => {
                    setRegistroSeleccionado(response.data);
                    setShowModalVerEgreso(true);
                })
                .catch((error) => {
                    console.error("Error al obtener el egreso:", error.message);
                });
        }
    };

    return (
        <AdminLayout>
            <div className="container mt-4">
                {/* Espacio para evitar que el contenido quede detrás del navbar */}
                <div style={{ height: "90px" }}></div>

                {/* Formulario de filtros */}
                <div className="d-flex justify-content-between align-items-center mb-4" style={{ paddingRight: "80px" }}>
                    <div className="col-md-6">
                        <h1>Historial de Movimientos</h1>
                    </div>
                    <div className="col-md-4">
                        <Form.Group>
                            <Form.Label>Filtrar por:</Form.Label>
                            <div>
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Fecha Exacta"
                                    name="filterType"
                                    value="fecha"
                                    checked={filterType === "fecha"}
                                    onChange={(e) => setFilterType(e.target.value)}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Año"
                                    name="filterType"
                                    value="anio"
                                    checked={filterType === "anio"}
                                    onChange={(e) => setFilterType(e.target.value)}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Rango de Fechas"
                                    name="filterType"
                                    value="rango"
                                    checked={filterType === "rango"}
                                    onChange={(e) => setFilterType(e.target.value)}
                                />
                            </div>
                        </Form.Group>

                        {filterType === "fecha" && (
                            <Form.Group controlId="fecha">
                                <Form.Label>Fecha:</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={fecha}
                                    onChange={(e) => setFecha(e.target.value)}
                                    className="thm-btn"
                                />
                            </Form.Group>
                        )}

                        {filterType === "anio" && (
                            <Form.Group controlId="anio">
                                <Form.Label>Año:</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={anio}
                                    onChange={(e) => setAnio(e.target.value)}
                                    className="thm-btn"
                                />
                            </Form.Group>
                        )}

                        {filterType === "rango" && (
                            <>
                                <Form.Group controlId="fechaInicio">
                                    <Form.Label>Fecha Inicio:</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={fechaInicio}
                                        onChange={(e) => setFechaInicio(e.target.value)}
                                        className="thm-btn"
                                    />
                                </Form.Group>
                                <Form.Group controlId="fechaFin">
                                    <Form.Label>Fecha Fin:</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={fechaFin}
                                        onChange={(e) => setFechaFin(e.target.value)}
                                        className="thm-btn"
                                    />
                                </Form.Group>
                            </>
                        )}

                        <div className="d-flex justify-content-center" style={{ marginTop: "10px" }}>
                            <Button className="btn-kreativa" onClick={fetchMovimientos}>
                                Buscar
                            </Button>
                        </div>
                    </div>
                </div>


                {/* Tabla de Movimientos */}
                <div className="table-responsive">
                    <Table className="table kreativa-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Entidad</th>
                                <th>Acción</th>
                                <th>Detalle</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movimientos.length > 0 ? (
                                movimientos.map((mov, index) => (
                                    <tr key={index}>
                                        <td>{new Date(mov.fecha).toLocaleDateString()}</td>
                                        <td>{mov.entidad}</td>
                                        <td>{mov.accion}</td>
                                        <td>{renderDetalle(mov)}</td>
                                        <td>
                                            <button
                                                className="thm-btn thm-btn-small btn-amarillo"
                                                onClick={() => handleVer(mov)}
                                                title="Ver detalle"
                                            >
                                                <FontAwesomeIcon icon={faEye} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: "center" }}>
                                        No se encontraron movimientos.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>

                {/* Modal para ver Ingreso */}
                {showModalVerIngreso && registroSeleccionado && (
                    <ModalVerIngreso
                        show={showModalVerIngreso}
                        handleClose={() => setShowModalVerIngreso(false)}
                        ingreso={registroSeleccionado}
                        categories={categories}
                    />
                )}

                {/* Modal para ver Egreso */}
                {showModalVerEgreso && registroSeleccionado && (
                    <ModalVerEgreso
                        show={showModalVerEgreso}
                        handleClose={() => setShowModalVerEgreso(false)}
                        egreso={registroSeleccionado}
                        categories={categories}
                    />
                )}
            </div>
        </AdminLayout>
    );
};

export default Movimientos;
