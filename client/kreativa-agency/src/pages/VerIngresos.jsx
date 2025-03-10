import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import axios from "axios";
import { Table, Button, Form, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPencil,
    faToggleOff,
    faToggleOn,
} from "@fortawesome/free-solid-svg-icons";

const VerIngresos = () => {
    const [ingresos, setIngresos] = useState([]);
    const [clientes, setClientes] = useState([]); // Almacenar clientes
    const [showModal, setShowModal] = useState(false);
    const [ingresoParaModificar, setIngresoParaModificar] = useState(null);

    const [search, setSearch] = useState(""); // Búsqueda por cédula
    const [estadoFiltro, setEstadoFiltro] = useState("Activo"); // Filtro por estado
    const [paginaActual, setPaginaActual] = useState(1); // Paginación
    const ingresosPorPagina = 5; // Cantidad de ingresos por página

    // Obtener ingresos y clientes
    useEffect(() => {
        const obtenerIngresosYClientes = async () => {
            try {
                const resIngresos = await axios.get(
                    "http://localhost:4000/api/ingresos"
                );
                setIngresos(resIngresos.data);

                const resClientes = await axios.get(
                    "http://localhost:4000/api/usuario"
                );
                setClientes(resClientes.data);
            } catch (error) {
                console.error(
                    "Error al obtener ingresos o clientes:",
                    error.message
                );
            }
        };

        obtenerIngresosYClientes();
    }, []);

    // Filtrar ingresos por búsqueda y estado
    const ingresosFiltrados = ingresos.filter((ingreso) => {
        const cédulaCliente = ingreso.cedula;

        return (
            (estadoFiltro === "Todos" ||
                (estadoFiltro === "Activo" && ingreso.activo) ||
                (estadoFiltro === "Inactivo" && !ingreso.activo)) &&
            (search === "" || cédulaCliente.includes(search)) // Buscamos por cédula
        );
    });

    // Paginación
    const indiceUltimoIngreso = paginaActual * ingresosPorPagina;
    const indicePrimerIngreso = indiceUltimoIngreso - ingresosPorPagina;
    const ingresosPaginados = ingresosFiltrados.slice(
        indicePrimerIngreso,
        indiceUltimoIngreso
    );

    const totalPaginas = Math.ceil(
        ingresosFiltrados.length / ingresosPorPagina
    );

    const cambiarPagina = (num) => {
        if (num >= 1 && num <= totalPaginas) setPaginaActual(num);
    };

    // Modificar estado del ingreso (activar/desactivar)
    const modificarIngreso = async () => {
        if (!ingresoParaModificar) return;

        const ingresoId = ingresoParaModificar._id;
        const url = ingresoParaModificar.activo
            ? `http://localhost:4000/api/ingresos/${ingresoId}/desactivar`
            : `http://localhost:4000/api/ingresos/${ingresoId}/activar`;

        try {
            await axios.put(url);
            setIngresos(
                ingresos.map((ingreso) =>
                    ingreso._id === ingresoId
                        ? { ...ingreso, activo: !ingreso.activo }
                        : ingreso
                )
            );
            setShowModal(false);
        } catch (error) {
            console.error("Error al modificar el ingreso:", error.message);
        }
    };

    // Abrir modal de confirmación
    const abrirModal = (ingreso) => {
        setIngresoParaModificar(ingreso);
        setShowModal(true);
    };

    const obtenerNombreCliente = (ingreso) => {
        return ingreso.nombre_cliente || "Desconocido"; // Directamente accedemos al nombre ingresado
    };

    return (
        <div>
            <Navbar />
            <div className="container">
                <h2>Ingresos</h2>

                {/* Filtros */}
                <div className="d-flex gap-3 mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Buscar por cédula"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Form.Select
                        value={estadoFiltro}
                        onChange={(e) => setEstadoFiltro(e.target.value)}
                    >
                        <option value="Activo">Activos</option>
                        <option value="Inactivo">Inactivos</option>
                        <option value="Todos">Todos</option>
                    </Form.Select>
                </div>

                {/* Tabla */}
                <Table className="kreativa-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Monto</th>
                            <th>Cédula</th>
                            <th>Nombre Cliente</th>
                            <th>Servicio</th>
                            <th>Descripción</th>
                            <th>Nota</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ingresosPaginados.length === 0 ? (
                            <tr>
                                <td colSpan="9">
                                    No hay ingresos para mostrar.
                                </td>
                            </tr>
                        ) : (
                            ingresosPaginados.map((ingreso) => (
                                <tr key={ingreso._id}>
                                    <td>
                                        {new Date(
                                            ingreso.fecha
                                        ).toLocaleDateString()}
                                    </td>
                                    <td>₡{ingreso.monto}</td>
                                    <td>{ingreso.cedula}</td>
                                    <td>
                                        {obtenerNombreCliente(ingreso)}
                                    </td>{" "}
                                    {/* Nombre Cliente */}
                                    <td>{ingreso.servicio}</td>
                                    <td>{ingreso.descripcion}</td>
                                    <td>{ingreso.nota}</td>
                                    <td>
                                        {ingreso.activo ? "Activo" : "Inactivo"}
                                    </td>
                                    <td>
                                        <Link
                                            to={`/ingreso/editar/${ingreso._id}`}
                                        >
                                            <Button
                                                className="thm-btn thm-btn-small btn-azul"
                                                disabled={!ingreso.activo}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faPencil}
                                                />
                                            </Button>
                                        </Link>{" "}
                                        <button
                                            className={
                                                ingreso.activo
                                                    ? "thm-btn thm-btn-small btn-verde"
                                                    : "thm-btn thm-btn-small btn-rojo"
                                            }
                                            onClick={() => abrirModal(ingreso)}
                                        >
                                            {ingreso.activo ? (
                                                <FontAwesomeIcon
                                                    icon={faToggleOn}
                                                />
                                            ) : (
                                                <FontAwesomeIcon
                                                    icon={faToggleOff}
                                                />
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>

                {/* Paginación */}
                {totalPaginas > 1 && (
                    <Pagination className="justify-content-center">
                        <Pagination.Prev
                            disabled={paginaActual === 1}
                            onClick={() => cambiarPagina(paginaActual - 1)}
                        />
                        {[...Array(totalPaginas)].map((_, index) => (
                            <Pagination.Item
                                key={index + 1}
                                active={index + 1 === paginaActual}
                                onClick={() => cambiarPagina(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            disabled={paginaActual === totalPaginas}
                            onClick={() => cambiarPagina(paginaActual + 1)}
                        />
                    </Pagination>
                )}

                {/* Modal de Confirmación */}
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmación</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {ingresoParaModificar?.activo
                            ? "¿Estás seguro de que deseas desactivar este ingreso?"
                            : "¿Estás seguro de que deseas activar este ingreso?"}
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            className="thm-btn-2 thm-btn-small"
                            onClick={() => setShowModal(false)}
                        >
                            Cancelar
                        </button>
                        <button
                            className={
                                ingresoParaModificar?.activo
                                    ? "thm-btn thm-btn-small btn-rojo"
                                    : "thm-btn thm-btn-small btn-amarillo"
                            }
                            onClick={modificarIngreso}
                        >
                            {ingresoParaModificar?.activo
                                ? "Desactivar"
                                : "Activar"}
                        </button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default VerIngresos;
