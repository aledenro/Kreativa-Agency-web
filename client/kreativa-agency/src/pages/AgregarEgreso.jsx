import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useState } from "react";
import { Modal } from "react-bootstrap";

const AgregarEgreso = () => {

    const [mensaje, setMensaje] = useState(""); 

    const handleSubmit = async (event) => {
        event.preventDefault();

        const fecha = event.target.fecha.value;
        const monto = event.target.monto.value;
        const categoria = event.target.categoria.value;
        const descripcion = event.target.descripcion.value;
        const proveedor = event.target.proveedor.value;
        const estado = event.target.estado.value;
        const nota = event.target.nota.value;

        const data = {
            fecha: fecha,
            monto: monto,
            categoria: categoria,
            descripcion: descripcion,
            proveedor: proveedor,
            estado: estado,
            nota: nota
        };

        try {
            const res = await axios.post("http://localhost:4000/api/egresos", data);
            console.log(res.data);
            setMensaje("¡Egreso agregado exitosamente! 🎉"); // Muestra mensaje de éxito
        } catch (error) {
            console.error(error.message);
            setMensaje("Error al agregar el egreso. 😞"); // Muestra mensaje de error
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center">
            <div className="card p-4 shadow-lg w-50">
                <h3 className="text-center mb-4">Agregar Egreso</h3>
                <Form onSubmit={handleSubmit} className="egreso_form">
                    <Form.Control
                        type="date"
                        placeholder="Fecha"
                        required
                        name="fecha"
                        className="egreso_input_box"
                    />
                    <br />
                    <Form.Control
                        type="number"
                        placeholder="Monto"
                        required
                        name="monto"
                        className="egreso_input_box"
                    />
                    <br />
                    <Form.Control
                        type="text"
                        placeholder="Categoría"
                        required
                        name="categoria"
                        className="egreso_input_box"
                    />
                    <br />
                    <Form.Control
                        as="textarea"
                        placeholder="Descripción"
                        style={{ height: "100px" }}
                        required
                        name="descripcion"
                        className="egreso_input_box"
                    />
                    <br />
                    <Form.Control
                        type="text"
                        placeholder="Proveedor"
                        required
                        name="proveedor"
                        className="egreso_input_box"
                    />
                    <br />
                    <Form.Select
                        required
                        name="estado"
                        className="egreso_input_box"
                        defaultValue="Pendiente"
                    >
                        <option value="Pendiente">Pendiente</option>
                        <option value="Aprobado">Aprobado</option>
                        <option value="Rechazado">Rechazado</option>
                    </Form.Select>
                    <br />
                    <Form.Control
                        type="text"
                        placeholder="Nota"
                        required
                        name="nota"
                        className="egreso_input_box"
                    />
                    <br />

                    <Button
                        variant="primary"
                        type="submit"
                        className="w-100 btn-light"
                    >
                        Agregar Egreso
                    </Button>
                </Form>

                {/* Asegúrate de que el mensaje se muestre correctamente */}
                {mensaje && (
                    <div className="alert alert-info mt-4">{mensaje}</div>
                )}
            </div>
        </div>
    );
};

export default AgregarEgreso;