import Form from "react-bootstrap/Form";
import Navbar from "../components/Navbar/Navbar";
import Alert from "react-bootstrap/Alert";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useState } from "react";

const AgregarIngreso = () => {
    const [mensaje, setMensaje] = useState("");

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
            descripcion,  // Agregado
            cedula,
            servicio,
            estado,
            nota,
            // fecha_creacion y ultima_modificacion son automáticos en Mongoose, no es necesario enviarlos desde el frontend
            activo: true  // Si no estás cambiando el estado, se puede dejar por defecto como true
        };

        try {
            const res = await axios.post("http://localhost:4000/api/ingresos", data);
            console.log(res.data);
            setMensaje("¡Ingreso agregado exitosamente!");
        } catch (error) {
            console.error(error.message);
            setMensaje("Error al agregar el ingreso.");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container">
                <div className="section-title text-center">
                    <h2>Agregar nuevo ingreso</h2>
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
                                    />
                                </div>
                                <div className="col">
                                    <input
                                        type="number"
                                        placeholder="Monto"
                                        required
                                        name="monto"
                                        className="form_input"
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <input
                                        type="text"
                                        placeholder="Descripción"
                                        required
                                        name="descripcion"  // Nuevo campo
                                        className="form_input"
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
                                    />
                                </div>
                                <div className="col">
                                    <input
                                        type="text"
                                        placeholder="Servicio"
                                        required
                                        name="servicio"
                                        className="form_input"
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <Form.Select
                                        required
                                        name="estado"
                                        className="form_input"
                                        defaultValue="Pendiente de pago"
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
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col text-center">
                                    <button type="submit" className="thm-btn form-btn">
                                        Agregar
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

export default AgregarIngreso;