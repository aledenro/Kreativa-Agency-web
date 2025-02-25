import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import axios from "axios";
import { Table, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";

const VerEgresos = () => {
    const [egresos, setEgresos] = useState([]);
    const [mostrarInactivos, setMostrarInactivos] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [egresoParaModificar, setEgresoParaModificar] = useState(null);

    const [categoriaFiltro, setCategoriaFiltro] = useState(""); // Filtro por categoría
    const [estadoFiltro, setEstadoFiltro] = useState("Todos"); // Filtro por estado

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
                        {egresosFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan="7">
                                    No hay egresos para mostrar.
                                </td>
                            </tr>
                        ) : (
                            egresosFiltrados.map((egreso) => (
                                <tr key={egreso._id}>
                                    <td>
                                        {new Date(
                                            egreso.fecha
                                        ).toLocaleDateString()}
                                    </td>
                                    <td>{egreso.monto}</td>
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
                                            <button
                                                className="thm-btn thm-btn-small btn-editar"
                                                disabled={!egreso.activo}
                                            >
                                                Editar
                                            </button>
                                        </Link>{" "}
                                        <button
                                            class={
                                                egreso.activo
                                                    ? "thm-btn thm-btn-small btn-eliminar"
                                                    : "thm-btn thm-btn-small btn-crear"
                                            }
                                            onClick={() => abrirModal(egreso)}
                                        >
                                            {egreso.activo
                                                ? "Desactivar"
                                                : "Activar"}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>

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
                                    ? "thm-btn thm-btn-small btn-eliminar"
                                    : "thm-btn thm-btn-small btn-crear"
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
