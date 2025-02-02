import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, Form } from "react-bootstrap";

const EditarEgreso = () => {
    const { id } = useParams(); // Obtener el ID del egreso desde la URL
    const [egreso, setEgreso] = useState(null);
    const [error, setError] = useState(null); // Para manejar errores

    // Obtener el egreso por ID
    useEffect(() => {
        const obtenerEgreso = async () => {
            try {
                const res = await axios.put(`http://localhost:4000/api/egresos/${id}`, datos);
                setEgreso(res.data); // Guardar el egreso en el estado
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

        const data = {
            fecha: event.target.fecha.value,
            monto: event.target.monto.value,
            categoria: event.target.categoria.value,
            descripcion: event.target.descripcion.value,
            proveedor: event.target.proveedor.value,
            estado: event.target.estado.value,
            nota: event.target.nota.value,
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
                    defaultValue={egreso.fecha}
                    name="fecha"
                    required
                    className="egreso_input_box"
                />
                <br />
                <Form.Control
                    type="number"
                    defaultValue={egreso.monto}
                    name="monto"
                    required
                    className="egreso_input_box"
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