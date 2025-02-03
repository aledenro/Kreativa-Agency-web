import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
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
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ObtenerEgresos;