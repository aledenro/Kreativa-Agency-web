import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import { NumericFormat } from "react-number-format";

const formatearFecha = (fecha) => {
    if (!fecha) return "";
    const date = new Date(fecha);
    return date.toISOString().split('T')[0];
};

const EditarIngreso = () => {
    const { id } = useParams(); // Obtener el ID del ingreso
    console.log("ID recibido en EditarIngreso:", id);

    const [ingreso, setIngreso] = useState(null);
    const [error, setError] = useState(null); // Para errores
    const [monto, setMonto] = useState(0); // Para manejar el monto

    // Obtener el ingreso por ID
    useEffect(() => {
        const obtenerIngreso = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/api/ingresos/${id}`);
                setIngreso(res.data); // Guardar el ingreso en el estado
                setMonto(res.data?.monto || 0);
            } catch (error) {
                setError("No se pudo obtener el ingreso");
            }
        };

        obtenerIngreso();
    }, [id]);

    // Si hay error, mostrar el mensaje de error
    if (error) {
        return <div>{error}</div>;
    }

    // Si el ingreso aún no ha sido cargado, no mostrar el formulario
    if (!ingreso) {
        return <div>Loading...</div>; // Poner algo visual
    }

    // Función para manejar el submit y editar el ingreso
    const handleSubmit = async (event) => {
        event.preventDefault();

        const fecha = event.target.fecha.value;
        const fechaActual = new Date().toISOString().split('T')[0];  // Obtener la fecha actual en formato YYYY-MM-DD

        // Validar que la fecha no sea posterior
        if (fecha > fechaActual) {
            alert("No puedes seleccionar una fecha futura.");
            return;
        }

        const data = {
            fecha: fecha,
            monto: monto,
            cliente: event.target.cliente.value, // Cambiado a cliente
            servicio: event.target.servicio.value, // Cambiado a servicio
            estado: event.target.estado.value,
            nota: event.target.nota.value,
            ultima_modificacion: new Date().toISOString(),
        };

        try {
            await axios.put(`http://localhost:4000/api/ingresos/${id}`, data); // Realizar la actualización
            alert("Ingreso actualizado exitosamente!");
        } catch (error) {
            console.error("Error al actualizar el ingreso:", error.message);
        }
    };

    return (
        <div>
            <Navbar></Navbar>
            <div className="container">
                <div className="section-title text-center">
                    <h2>Editar ingreso</h2>
                </div>
                <div className="mx-auto align-items-center justify-content-center d-flex">
                    <div className="col-xl-8">
                        <Form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col">
                                    <input
                                        type="date"
                                        defaultValue={ingreso.fecha ? formatearFecha(ingreso.fecha) : ""}
                                        name="fecha"
                                        required
                                        max={new Date().toISOString().split('T')[0]} // Fecha máxima: hoy
                                        className="form_input"
                                    />
                                </div>
                                <div className="col">
                                    <NumericFormat
                                        thousandSeparator
                                        prefix="₡"
                                        value={monto}
                                        name="monto"
                                        required
                                        className="form_input"
                                        allowNegative={false}
                                        decimalScale={2}
                                        fixedDecimalScale
                                        onValueChange={(values) => setMonto(values.floatValue || 0)}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <input
                                        type="text"
                                        defaultValue={ingreso.cliente} // Cambiado a cliente
                                        name="cliente"
                                        required
                                        className="form_input"
                                    />
                                </div>
                                <div className="col">
                                    <input
                                        type="text"
                                        defaultValue={ingreso.servicio} // Cambiado a servicio
                                        name="servicio"
                                        required
                                        className="form_input"
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <Form.Select
                                        required
                                        name="estado"
                                        defaultValue={ingreso.estado}
                                        className="form_input"
                                    >
                                        <option value="Pendiente">Pendiente</option>
                                        <option value="Aprobado">Aprobado</option>
                                        <option value="Rechazado">Rechazado</option>
                                    </Form.Select>
                                </div>
                                <div className="col">
                                    <input
                                        type="text"
                                        defaultValue={ingreso.nota}
                                        name="nota"
                                        required
                                        className="form_input"
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col text-center">
                                    <button type="submit" className="thm-btn form-btn">
                                        Confirmar
                                    </button>
                                </div>
                            </div>

                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditarIngreso;