import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";

const VerIngresos = () => {
    const [ingresos, setIngresos] = useState([]);
    const [mostrarInactivos, setMostrarInactivos] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [ingresoParaModificar, setIngresoParaModificar] = useState(null);

    useEffect(() => {
        const obtenerIngresos = async () => {
            try {
                const res = await axios.get("http://localhost:4000/api/ingresos");
                setIngresos(res.data);
            } catch (error) {
                console.error("Error al obtener ingresos:", error.message);
            }
        };

        obtenerIngresos();
    }, []);

    const modificarIngreso = async () => {
        if (!ingresoParaModificar) return;

        const ingresoId = ingresoParaModificar._id;
        const url = ingresoParaModificar.activo
            ? `http://localhost:4000/api/ingresos/${ingresoId}/desactivar`
            : `http://localhost:4000/api/ingresos/${ingresoId}/activar`;

        try {
            await axios.put(url);
            setIngresos(ingresos.map(ingreso =>
                ingreso._id === ingresoId ? { ...ingreso, activo: !ingreso.activo } : ingreso
            ));
            setShowModal(false);
        } catch (error) {
            console.error("Error al modificar el ingreso:", error.message);
        }
    };

    const abrirModal = (ingreso) => {
        setIngresoParaModificar(ingreso);
        setShowModal(true);
    };

    const ingresosFiltrados = ingresos.filter(ingreso => ingreso.activo === !mostrarInactivos);

    return (
        <div>
            <Navbar />
            <h2>Ingresos</h2>
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
                        <th>Cliente</th>
                        <th>Servicio</th>
                        <th>Estado</th>
                        <th>Nota</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ingresosFiltrados.length === 0 ? (
                        <tr>
                            <td colSpan="7">No hay ingresos para mostrar.</td>
                        </tr>
                    ) : (
                        ingresosFiltrados.map((ingreso) => (
                            <tr key={ingreso._id}>
                                <td>{new Date(ingreso.fecha).toLocaleDateString()}</td>
                                <td>{ingreso.monto}</td>
                                <td>{ingreso.cliente}</td>
                                <td>{ingreso.servicio}</td>
                                <td>{ingreso.estado}</td>
                                <td>{ingreso.nota}</td>

                                <td>
                                    <Link to={`/ingreso/editar/${ingreso._id}`}>
                                        <Button variant="warning" disabled={!ingreso.activo}>Editar</Button>
                                    </Link>
                                    {" "}
                                    <Button
                                        variant={ingreso.activo ? "danger" : "success"}
                                        onClick={() => abrirModal(ingreso)}
                                    >
                                        {ingreso.activo ? "Desactivar" : "Activar"}
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
                    {ingresoParaModificar?.activo
                        ? "¿Estás seguro de que deseas desactivar este ingreso?"
                        : "¿Estás seguro de que deseas activar este ingreso?"}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant={ingresoParaModificar?.activo ? "danger" : "success"} onClick={modificarIngreso}>
                        {ingresoParaModificar?.activo ? "Desactivar" : "Activar"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default VerIngresos;