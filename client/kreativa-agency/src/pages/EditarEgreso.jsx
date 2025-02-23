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

const EditarEgreso = () => {
    const { id } = useParams(); // Obtener el ID del egreso
    console.log("ID recibido en EditarEgreso:", id);

    const [egreso, setEgreso] = useState(null);
    const [error, setError] = useState(null); // Para errores
    const [monto, setMonto] = useState(0); // Para que el monto

    // Obtener el egreso por ID
    useEffect(() => {
        const obtenerEgreso = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/api/egresos/${id}`);
                setEgreso(res.data); // Guardar el egreso en el estado
                setMonto(res.data?.monto || 0);
            } catch (error) {
                setError("No se pudo obtener el egreso");
            }
        };

        obtenerEgreso();
    }, [id]);

    // Si hay error, mostrar el mensaje de error
    if (error) {
        return <div>{error}</div>;
    }

    // Si el egreso aún no ha sido cargado, no mostrar el formulario
    if (!egreso) {
        return <div>Loading...</div>; // Poner algo visual
    }

    // Función para manejar el submit y editar el egreso
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
            categoria: event.target.categoria.value,
            descripcion: event.target.descripcion.value,
            proveedor: event.target.proveedor.value,
            estado: event.target.estado.value,
            nota: event.target.nota.value,
            ultima_modificacion: new Date().toISOString(),
        };

        try {
            await axios.put(`http://localhost:4000/api/egresos/${id}`, data); // Realizar la actualización
            alert("Egreso actualizado exitosamente!");
        } catch (error) {
            console.error("Error al actualizar el egreso:", error.message);
        }
    };

    return (
        <div>
            <Navbar></Navbar>
            <div className="container">
                <div className="section-title text-center">
                    <h2>Editar agreso</h2>
                </div>
                <div className="mx-auto align-items-center justify-content-center d-flex">
                    <div className="col-xl-8">
                        <Form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="">
                                    <input
                                        type="date"
                                        defaultValue={egreso.fecha ? formatearFecha(egreso.fecha) : ""}
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
                                <div className="">
                                    <input
                                        type="text"
                                        defaultValue={egreso.categoria}
                                        name="categoria"
                                        required
                                        className="form_input"
                                    />
                                </div>
                                <div className="col">
                                    <input
                                        as="textarea"
                                        defaultValue={egreso.descripcion}
                                        name="descripcion"
                                        required
                                        className="form_input"
                                        style={{ height: "100px" }}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="">
                                    <input
                                        type="text"
                                        defaultValue={egreso.proveedor}
                                        name="proveedor"
                                        required
                                        className="form_input"
                                    />
                                </div>
                                <div className="col">
                                    <Form.Select
                                        required
                                        name="estado"
                                        defaultValue={egreso.estado}
                                        className="form_input"
                                    >
                                        <option value="Pendiente de pago">Pendiente de pago</option>
                                        <option value="Aprobado">Aprobado</option>
                                    </Form.Select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <input
                                        type="text"
                                        defaultValue={egreso.nota}
                                        name="nota"
                                        required
                                        className="form_input"
                                    />
                                    <button type="submit" className="thm-btn form-btn">
                                        confirmar
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

export default EditarEgreso;