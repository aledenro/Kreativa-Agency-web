import Form from "react-bootstrap/Form";
import Navbar from "../components/Navbar/Navbar";
import Alert from "react-bootstrap/Alert";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Usa useNavigate en lugar de useHistory

const EditarIngreso = () => {
    const [mensaje, setMensaje] = useState("");
    const [ingreso, setIngreso] = useState(null);
    const { id } = useParams(); // Obtener el ID del ingreso desde la URL
    const navigate = useNavigate(); // Usa useNavigate en lugar de useHistory

    // Obtener los detalles del ingreso cuando el componente se monta
    useEffect(() => {
        const obtenerIngreso = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/api/ingresos/${id}`);
                setIngreso(res.data);
            } catch (error) {
                console.error(error.message);
                setMensaje("Error al obtener el ingreso.");
            }
        };

        obtenerIngreso();
    }, [id]);

    // Manejar la edición del ingreso
    const handleSubmit = async (event) => {
        event.preventDefault();

        const fecha = event.target.fecha.value;
        const monto = event.target.monto.value;
        const descripcion = event.target.descripcion.value;
        const cedula = event.target.cedula.value;
        const servicio = event.target.servicio.value;
        const estado = event.target.estado.value;
        const nota = event.target.nota.value;

        const data = {
            fecha,
            monto,
            descripcion,
            cedula,
            servicio,
            estado,
            nota,
            activo: true, // Si no estás cambiando el estado, se puede dejar por defecto como true
        };

        try {
            const res = await axios.put(`http://localhost:4000/api/ingresos/${id}`, data);
            console.log(res.data);
            setMensaje("¡Ingreso actualizado exitosamente!");
            // Redirigir a otra página (por ejemplo, la lista de ingresos) después de la edición
            navigate("/ingresos"); // Usa navigate para redirigir
        } catch (error) {
            console.error(error.message);
            setMensaje("Error al actualizar el ingreso.");
        }
    };

    if (!ingreso) {
        return <div>Cargando...</div>; // Muestra un mensaje mientras se cargan los datos del ingreso
    }

    return (
        <div>
            <Navbar />
            <div className="container">
                <div className="section-title text-center">
                    <h2>Editar ingreso</h2>
                </div>
                <div className="mx-auto align-items-center justify-content-center d-flex">
                    <div className="col-xl-8">
                        <Form onSubmit={handleSubmit} className="ingreso_form">
                            <div className="row">
                                <div className="col">
                                    <input
                                        type="date"
                                        placeholder="Fecha"
                                        required
                                        name="fecha"
                                        className="form_input"
                                        defaultValue={ingreso.fecha.split("T")[0]} // Valor por defecto desde los datos cargados
                                    />
                                </div>
                                <div className="col">
                                    <input
                                        type="number"
                                        placeholder="Monto"
                                        required
                                        name="monto"
                                        className="form_input"
                                        defaultValue={ingreso.monto}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <input
                                        type="text"
                                        placeholder="Descripción"
                                        required
                                        name="descripcion"
                                        className="form_input"
                                        defaultValue={ingreso.descripcion}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <input
                                        type="text"
                                        placeholder="Cédula"
                                        required
                                        name="cedula"
                                        className="form_input"
                                        defaultValue={ingreso.cedula}
                                    />
                                </div>
                                <div className="col">
                                    <input
                                        type="text"
                                        placeholder="Servicio"
                                        required
                                        name="servicio"
                                        className="form_input"
                                        defaultValue={ingreso.servicio}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <Form.Select
                                        required
                                        name="estado"
                                        className="form_input"
                                        defaultValue={ingreso.estado}
                                    >
                                        <option value="Pendiente de pago">Pendiente de pago</option>
                                        <option value="Aprobado">Aprobado</option>
                                    </Form.Select>
                                </div>
                                <div className="col">
                                    <input
                                        type="text"
                                        placeholder="Nota"
                                        required
                                        name="nota"
                                        className="form_input"
                                        defaultValue={ingreso.nota}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col text-center">
                                    <button type="submit" className="thm-btn form-btn">
                                        Editar
                                    </button>
                                </div>
                            </div>
                        </Form>

                        {mensaje && (
                            <Alert variant="info" className="mt-4">
                                {mensaje}
                            </Alert>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditarIngreso;