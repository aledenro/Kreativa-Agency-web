import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

const VerCotizaciones = () => {
    const [cotizaciones, setCotizaciones] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function getCotizaciones() {
            try {
                const response = await axios.get(
                    "http://localhost:4000/api/cotizaciones/"
                );
                setCotizaciones(response.data.cotizaciones);
            } catch (error) {
                console.error(error.message);
            }
        }

        getCotizaciones();
    }, []);

    function handleVerDetalles(id) {
        navigate(`/cotizacion/${id}`);
    }

    if (!cotizaciones) {
        return (
            <div className="container d-flex align-items-center justify-content-center">
                <p>Cargando cotizaciones...</p>
            </div>
        );
    }

    return (
        <div>
            <Navbar></Navbar>
            <h3 className="section-title text-center">
                Listado de Cotizaciones
            </h3>

            <div className="container pt-3  table-responsive">
                <div className="row mb-3">
                    <div className="col text-end">
                        <button
                            className="thm-btn btn-crear"
                            onClick={() => navigate("/cotizacion/agregar")}
                        >
                            Solicitar Cotización
                        </button>
                    </div>
                </div>
                <table className="table kreativa-table">
                    <thead>
                        <tr>
                            <th scope="col">Titulo</th>
                            <th scope="col">Cliente</th>
                            <th scope="col">Estado</th>
                            <th scope="col">Fecha</th>
                            <th scope="col">Urgente</th>
                            <th scope="col">Ver Detalles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cotizaciones.map((cotizacion) => (
                            <tr key={cotizacion._id}>
                                <td>{cotizacion.titulo}</td>
                                <td>{cotizacion.cliente_id.nombre}</td>
                                <td>{cotizacion.estado}</td>
                                <td>
                                    {new Date(
                                        cotizacion.fecha_solicitud
                                    ).toLocaleDateString()}
                                </td>
                                <td>{cotizacion.urgente ? "Si" : "No"}</td>
                                <td>
                                    <button
                                        className="thm-btn thm-btn-small btn-ver"
                                        onClick={() =>
                                            handleVerDetalles(cotizacion._id)
                                        }
                                    >
                                        Ver detalles
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VerCotizaciones;
