import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const ObtenerEgresos = () => {
    const [egresos, setEgresos] = useState([]);

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

    return (
        <div className="container mt-5">
            <h2>Listado de Egresos</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
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
                    {egresos.map((egreso) => (
                        <tr key={egreso._id}>
                            <td>{egreso._id}</td>
                            <td>{new Date(egreso.fecha).toLocaleDateString()}</td>
                            <td>{egreso.monto}</td>
                            <td>{egreso.categoria}</td>
                            <td>{egreso.descripcion}</td>
                            <td>{egreso.proveedor}</td>
                            <td>{egreso.estado}</td>
                            <td>
                                {/* Enlace para editar el egreso */}
                                <Link to={`/egreso/editar/${egreso._id}`}>
                                    <Button variant="warning">Editar</Button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default ObtenerEgresos;