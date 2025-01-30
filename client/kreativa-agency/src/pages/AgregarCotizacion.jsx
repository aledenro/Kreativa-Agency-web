import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function construirJsonRequest(descripcion, urgente) {
    return {
        cliente_id: "679834de23a11c303cf6c6b5",
        detalles: descripcion,
        urgente: urgente,
        historial_respuestas: [],
        estado: "Nuevo",
    };
}

const handleSubmit = async (event) => {
    event.preventDefault();

    const descripcion = event.target.descripcion.value;
    const urgente = event.target.urgente.checked;

    const data = construirJsonRequest(descripcion, urgente);

    try {
        const res = await axios.post(
            "http://localhost:4000/api/cotizaciones/crear",
            data
        );
        console.log(res.data);
    } catch (error) {
        console.error(error.message);
    }
};

const AgregarCotizacion = () => {
    return (
        <div className="container d-flex align-items-center justify-content-center">
            <div className="card p-4 shadow-lg w-50">
                <h3 className="text-center mb-4">Agregar Cotización</h3>
                <Form onSubmit={handleSubmit} className="cotizacion_form">
                    <Form.Control
                        as="textarea"
                        placeholder="Describa su solicitud"
                        style={{ height: "200px" }}
                        required
                        name="descripcion"
                        className="cotizacion_input_box"
                    />
                    <br />
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        <Form.Check
                            type="checkbox"
                            label="Urgente"
                            name="urgente"
                            className="cotizacion_check_box"
                        />
                    </Form.Group>

                    <Button
                        variant="primary"
                        type="submit"
                        className="w-100 btn-light"
                    >
                        Submit
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default AgregarCotizacion;
