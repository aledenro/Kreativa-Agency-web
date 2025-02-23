import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";

const VerEgresos = () => {
    const [egresos, setEgresos] = useState([]);
    const [mostrarInactivos, setMostrarInactivos] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [egresoParaModificar, setEgresoParaModificar] = useState(null);

    useEffect(() => {
        const obtenerEgresos = async () => {
            try {
                const res = await axios.get("http://localhost:4000/api/egresos");
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
            setEgresos(egresos.map(egreso =>
                egreso._id === egresoId ? { ...egreso, activo: !egreso.activo } : egreso
            ));
            setShowModal(false);
        } catch (error) {
            console.error("Error al modificar el egreso:", error.message);
        }
    };

    const abrirModal = (egreso) => {
        setEgresoParaModificar(egreso);
        setShowModal(true);
    };

    const egresosFiltrados = egresos.filter(egreso => egreso.activo === !mostrarInactivos);

    return (
        <div>
            <Navbar />
            <h2>Egresos</h2>
            <Button
                variant={mostrarInactivos ? "secondary" : "primary"}
                onClick={() => setMostrarInactivos(!mostrarInactivos)}
            >
                {mostrarInactivos ? "Ver Activos" : "Ver Inactivos"}
            </Button>
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
                            <td colSpan="7">No hay egresos para mostrar.</td>
                        </tr>
                    ) : (
                        egresosFiltrados.map((egreso) => (
                            <tr key={egreso._id}>
                                <td>{new Date(egreso.fecha).toLocaleDateString()}</td>
                                <td>{egreso.monto}</td>
                                <td>{egreso.categoria}</td>
                                <td>{egreso.descripcion}</td>
                                <td>{egreso.proveedor}</td>
                                <td>{egreso.estado}</td> {/* Mostrar estado correcto */}

                                <td>
                                    <Link to={`/egreso/editar/${egreso._id}`}>
                                        <Button variant="warning" disabled={!egreso.activo}>Editar</Button>
                                    </Link>
                                    {" "}
                                    <Button
                                        variant={egreso.activo ? "danger" : "success"}
                                        onClick={() => abrirModal(egreso)}
                                    >
                                        {egreso.activo ? "Desactivar" : "Activar"}
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

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
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant={egresoParaModificar?.activo ? "danger" : "success"} onClick={modificarEgreso}>
                        {egresoParaModificar?.activo ? "Desactivar" : "Activar"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default VerEgresos;