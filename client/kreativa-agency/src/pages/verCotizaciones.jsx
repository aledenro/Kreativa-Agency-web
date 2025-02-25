import { useState, useEffect } from "react";
import axios from "axios";
import lodash from "lodash";
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

    return (
        <div>
            <Navbar></Navbar>
            <div className="container">
                <table className="table table-striped">
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
                                        className="thm-btn"
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
