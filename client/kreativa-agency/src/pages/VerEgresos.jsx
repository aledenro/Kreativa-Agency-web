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

const VerEgresos = () => {
    const [egresos, setEgresos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [egresoParaModificar, setEgresoParaModificar] = useState(null);

    const [categoriaFiltro, setCategoriaFiltro] = useState(""); // Filtro por categoría
    const [estadoFiltro, setEstadoFiltro] = useState("Todos"); // Filtro por estado

    const [paginaActual, setPaginaActual] = useState(1); // Paginación
    const egresosPorPagina = 5; // Cantidad de egresos por página

    useEffect(() => {
        const obtenerEgresos = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:4000/api/egresos"
                );
                setEgresos(res.data);
            } catch (error) {
                console.error("Error al obtener egresos:", error.message);
            }
        };

        obtenerEgresos();
    }, []);

    const modificarEgreso = async () => {
        if (!egresoParaModificar) return;

        const egresoId = egresoParaModificar._id;
        const url = egresoParaModificar.activo
            ? `http://localhost:4000/api/egresos/${egresoId}/desactivar`
            : `http://localhost:4000/api/egresos/${egresoId}/activar`;

        try {
            await axios.put(url);
            setEgresos(
                egresos.map((egreso) =>
                    egreso._id === egresoId
                        ? { ...egreso, activo: !egreso.activo }
                        : egreso
                )
            );
            setShowModal(false);
        } catch (error) {
            console.error("Error al modificar el egreso:", error.message);
        }
    };

    const abrirModal = (egreso) => {
        setEgresoParaModificar(egreso);
        setShowModal(true);
    };

    // Filtrar los egresos según el estado y la categoría
    const egresosFiltrados = egresos.filter((egreso) => {
        const cumpleEstado =
            estadoFiltro === "Todos" ||
            (estadoFiltro === "Activo" && egreso.activo) ||
            (estadoFiltro === "Inactivo" && !egreso.activo);

        const cumpleCategoria =
            categoriaFiltro === "" ||
            egreso.categoria
                .toLowerCase()
                .includes(categoriaFiltro.toLowerCase());

        return cumpleEstado && cumpleCategoria;
    });

    // Paginación
    const indiceUltimoEgreso = paginaActual * egresosPorPagina;
    const indicePrimerEgreso = indiceUltimoEgreso - egresosPorPagina;
    const egresosPaginados = egresosFiltrados.slice(
        indicePrimerEgreso,
        indiceUltimoEgreso
    );

    const totalPaginas = Math.ceil(egresosFiltrados.length / egresosPorPagina);

    const cambiarPagina = (num) => {
        if (num >= 1 && num <= totalPaginas) setPaginaActual(num);
    };

    return (
        <div>
            <Navbar />
            <div className="container">
                <h2>Egresos</h2>

                {/* Filtros */}
                <div className="d-flex gap-3 mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Buscar por categoría"
                        value={categoriaFiltro}
                        onChange={(e) => setCategoriaFiltro(e.target.value)}
                    />
                    <Form.Select
                        value={estadoFiltro}
                        onChange={(e) => setEstadoFiltro(e.target.value)}
                    >
                        <option value="Todos">Todos</option>
                        <option value="Activo">Activos</option>
                        <option value="Inactivo">Inactivos</option>
                    </Form.Select>
                </div>

                {/* Tabla */}
                <Table className="kreativa-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Monto</th>
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
                                <td colSpan="7">
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
                                    <td>{egreso.categoria}</td>
                                    <td>{egreso.descripcion}</td>
                                    <td>{egreso.proveedor}</td>
                                    <td>
                                        {egreso.activo ? "Activo" : "Inactivo"}
                                    </td>
                                    <td>
                                        <Link
                                            to={`/egreso/editar/${egreso._id}`}
                                        >
                                            <Button
                                                className="thm-btn thm-btn-small btn-azul"
                                                disabled={!egreso.activo}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faPencil}
                                                />
                                            </Button>
                                        </Link>{" "}
                                        <button
                                            className={
                                                egreso.activo
                                                    ? "thm-btn thm-btn-small btn-verde"
                                                    : "thm-btn thm-btn-small btn-rojo"
                                            }
                                            onClick={() => abrirModal(egreso)}
                                        >
                                            {egreso.activo ? (
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
                        {egresoParaModificar?.activo
                            ? "¿Estás seguro de que deseas desactivar este egreso?"
                            : "¿Estás seguro de que deseas activar este egreso?"}
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
                                egresoParaModificar?.activo
                                    ? "thm-btn thm-btn-small btn-rojo"
                                    : "thm-btn thm-btn-small btn-amarillo"
                            }
                            onClick={modificarEgreso}
                        >
                            {egresoParaModificar?.activo
                                ? "Desactivar"
                                : "Activar"}
                        </button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default VerEgresos;
