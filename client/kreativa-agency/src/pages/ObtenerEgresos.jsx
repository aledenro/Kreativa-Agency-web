import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";


const ObtenerEgresos = () => {
    const [egresos, setEgresos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [egresoIdEliminar, setEgresoIdEliminar] = useState(null);

    // Obtener todos los egresos
    useEffect(() => {
        const obtenerEgresos = async () => {
            try {
                const res = await axios.get("http://localhost:4000/api/egresos");
                setEgresos(res.data); // Guardar los egresos en el estado
            } catch (error) {
                console.error("Error al obtener egresos:", error.message);
            }
        };

        obtenerEgresos();
    }, []);

    // Función para abrir el modal de confirmación
    const confirmarEliminar = (id) => {
        setEgresoIdEliminar(id);
        setShowModal(true);
    };

    // Función para eliminar el egreso
    const eliminarEgreso = async () => {
        try {
            await axios.delete(`http://localhost:4000/api/egresos/${egresoIdEliminar}`);
            setEgresos(egresos.filter((egreso) => egreso._id !== egresoIdEliminar));
            setShowModal(false); // Cerrar el modal después de eliminar
        } catch (error) {
            console.error("Error al eliminar el egreso:", error.message);
        }
    };

    return (
        <div>
            <Navbar></Navbar>
            <h2>Egresos</h2>
            <table className="kreativa-table">
                <thead>
                    <tr>
                        <th scope="col">Fecha</th>
                        <th scope="col">Monto</th>
                        <th scope="col">Categoría</th>
                        <th scope="col">Descripción</th>
                        <th scope="col">Proveedor</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {egresos.map((egreso) => (
                        <tr key={egreso._id}>
                            <td data-label>{new Date(egreso.fecha).toLocaleDateString()}</td>
                            <td data-label>{egreso.monto}</td>
                            <td data-label>{egreso.categoria}</td>
                            <td data-label>{egreso.descripcion}</td>
                            <td data-label>{egreso.proveedor}</td>
                            <td data-label>{egreso.estado}</td>
                            <td data-label>
                                {/* Enlace para editar el egreso */}
                                <Link to={`/egreso/editar/${egreso._id}`}>
                                    <Button variant="warning">Editar</Button>
                                </Link>
                                {/* Botón Eliminar */}
                                <Button variant="danger" onClick={() => confirmarEliminar(egreso._id)}>
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal de Confirmación */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>¿Estás seguro de que deseas eliminar este egreso?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={eliminarEgreso}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default ObtenerEgresos;