import Form from "react-bootstrap/Form";
import Navbar from "../components/Navbar/Navbar";
import Alert from "react-bootstrap/Alert";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useState } from "react";

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
            nota: nota,
        };

        try {
            const res = await axios.post(
                "http://localhost:4000/api/egresos",
                data
            );
            console.log(res.data);
            setMensaje("¡Egreso agregado exitosamente!");
        } catch (error) {
            console.error(error.message);
            setMensaje("Error al agregar el egreso.");
        }
    };

    return (
        <div>
            <Navbar></Navbar>
            <div className="container">
                <div className="section-title text-center">
                    <h2>Agregar nuevo egreso</h2>
                </div>
                <div className="mx-auto align-items-center justify-content-center d-flex">
                    <div className="col-xl-8">
                        <Form onSubmit={handleSubmit} className="egreso_form">
                            <div className="row">
                                <div className="">
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
                                <div className="">
                                    <Form.Select
                                        required
                                        name="categoria"
                                        className="form_input"
                                    >
                                        <option value="">
                                            Selecciona una categoría
                                        </option>
                                        <option value="Salarios">
                                            Salarios
                                        </option>
                                        <option value="Software">
                                            Software
                                        </option>
                                        <option value="Servicios de contabilidad">
                                            Servicios de contabilidad
                                        </option>
                                        <option value="Servicios">
                                            Servicios
                                        </option>
                                    </Form.Select>
                                </div>
                                <div className="col">
                                    <input
                                        as="textarea"
                                        placeholder="Descripción"
                                        style={{ height: "100px" }}
                                        required
                                        name="descripcion"
                                        className="form_input"
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="">
                                    <input
                                        type="text"
                                        placeholder="Proveedor"
                                        required
                                        name="proveedor"
                                        className="form_input"
                                    />
                                </div>
                                <div className="col">
                                    <Form.Select
                                        required
                                        name="estado"
                                        className="form_input"
                                        defaultValue="Pendiente"
                                    >
                                        <option value="Pendiente">
                                            Pendiente
                                        </option>
                                        <option value="Aprobado">
                                            Aprobado
                                        </option>
                                        <option value="Rechazado">
                                            Rechazado
                                        </option>
                                    </Form.Select>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <input
                                        type="text"
                                        placeholder="Nota"
                                        required
                                        name="nota"
                                        className="form_input"
                                    />
                                    <button
                                        type="submit"
                                        className="thm-btn form-btn"
                                    >
                                        Agregar
                                    </button>
                                </div>
                            </div>
                        </Form>

                        {/* Asegurarse de que el mensaje se muestre correctamente */}
                        {mensaje && (
                            <div className="alert alert-info mt-4">
                                {mensaje}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgregarEgreso;
