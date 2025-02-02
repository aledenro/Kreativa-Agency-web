import React, { useState, useEffect } from "react";
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
        <div className="container mt-5">
            <h2>Editar Egreso</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Control
                    type="date"
                    defaultValue={egreso.fecha ? formatearFecha(egreso.fecha) : ""}
                    name="fecha"
                    required
                    max={new Date().toISOString().split('T')[0]} // Fecha máxima: hoy
                    className="egreso_input_box"
                />
                <br />
                <NumericFormat
                    thousandSeparator
                    prefix="₡"
                    value={monto}
                    name="monto"
                    required
                    className="egreso_input_box"
                    allowNegative={false}
                    decimalScale={2}
                    fixedDecimalScale
                    onValueChange={(values) => setMonto(values.floatValue || 0)}
                />
                <br />
                <Form.Control
                    type="text"
                    defaultValue={egreso.categoria}
                    name="categoria"
                    required
                    className="egreso_input_box"
                />
                <br />
                <Form.Control
                    as="textarea"
                    defaultValue={egreso.descripcion}
                    name="descripcion"
                    required
                    className="egreso_input_box"
                    style={{ height: "100px" }}
                />
                <br />
                <Form.Control
                    type="text"
                    defaultValue={egreso.proveedor}
                    name="proveedor"
                    required
                    className="egreso_input_box"
                />
                <br />
                <Form.Select
                    required
                    name="estado"
                    defaultValue={egreso.estado}
                    className="egreso_input_box"
                >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Aprobado">Aprobado</option>
                    <option value="Rechazado">Rechazado</option>
                </Form.Select>
                <br />
                <Form.Control
                    type="text"
                    defaultValue={egreso.nota}
                    name="nota"
                    required
                    className="egreso_input_box"
                />
                <br />
                <Button variant="primary" type="submit" className="w-100 btn-light">
                    Actualizar Egreso
                </Button>
            </Form>
        </div>
    );
};

export default EditarEgreso;