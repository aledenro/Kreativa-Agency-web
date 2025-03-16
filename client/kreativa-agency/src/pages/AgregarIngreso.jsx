import Form from "react-bootstrap/Form";
import Navbar from "../components/Navbar/Navbar";
import Alert from "react-bootstrap/Alert";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useState } from "react";

const AgregarIngreso = () => {
    const [mensaje, setMensaje] = useState("");
    const [cedula, setCedula] = useState("");
    const [nombreCliente, setNombreCliente] = useState("");
    const [errorCedula, setErrorCedula] = useState("");
    const today = new Date().toISOString().split('T')[0];
    const validarCedula = (cedula) => {
        const cedulaRegex = /^[0-9]{8,9}$/;
        return cedulaRegex.test(cedula);
    };

    // Buscar el nombre del cliente por cédula
    const buscarNombreCliente = async () => {
        if (cedula.trim() === "") return;

        // Validar cédula antes de hacer la búsqueda
        if (!validarCedula(cedula)) {
            setErrorCedula("La cédula debe tener entre 8 y 9 dígitos.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:4000/api/ingresos/buscarPorCedula/${cedula}`);
            const data = await response.json();

            if (response.ok) {
                setNombreCliente(data.nombre);  // Asigna el nombre del cliente
                setErrorCedula("");  // Limpiar el error si todo está bien
            } else {
                setNombreCliente("");  // Limpiar el nombre si no se encuentra el cliente
                setErrorCedula("Cliente no encontrado");  // Mostrar mensaje de error
            }
        } catch (error) {
            console.error("Error al buscar el cliente:", error);
            setErrorCedula("Error al buscar cliente");  // En caso de error en la API
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const fecha = event.target.fecha.value;
        const monto = event.target.monto.value;
        const descripcion = event.target.descripcion.value;
        const servicio = event.target.servicio.value;
        const estado = event.target.estado.value;
        //const nota = event.target.nota.value;

        const data = {
            fecha,
            monto,
            descripcion,
            cedula,
            servicio,
            estado,
            //nota,
            activo: true
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
            <br></br>
            <br></br>
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
                                        min={today}
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
                                        name="descripcion"
                                        className="form_input"
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <input
                                        type="text"
                                        value={cedula}
                                        onChange={(e) => setCedula(e.target.value)}
                                        onBlur={buscarNombreCliente}
                                        placeholder="Ingrese la cédula"
                                        required
                                        className="form_input"
                                    />
                                </div>
                                <div className="col">
                                    <input
                                        type="text"
                                        value={nombreCliente}
                                        readOnly
                                        placeholder="Nombre del cliente"
                                        className="form_input"
                                    />
                                </div>
                            </div>

                            {errorCedula && (
                                <div className="row">
                                    <div className="col">
                                        <Alert variant="danger" className="mt-2">
                                            {errorCedula}
                                        </Alert>
                                    </div>
                                </div>
                            )}

                            <div className="row">
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
                                        <option value="Pagado">Pagado</option>
                                    </Form.Select>
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
