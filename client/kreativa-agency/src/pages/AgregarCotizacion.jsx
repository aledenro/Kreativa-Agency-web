import axios from "axios";

function construirJsonRequest(titulo, descripcion, urgente) {
    return {
        cliente_id: "679834de23a11c303cf6c6b5",
        titulo: titulo,
        detalles: descripcion,
        urgente: urgente,
        historial_respuestas: [],
        estado: "Nuevo",
    };
}

const handleSubmit = async (event) => {
    event.preventDefault();

    const enviar = confirm("¿Desea enviar su cotización?");

    if (!enviar) {
        return;
    }

    const formData = new FormData(event.target);

    const titulo = formData.get("titulo");
    const descripcion = formData.get("descripcion");
    const urgente = formData.get("urgente") === "on";

    const data = construirJsonRequest(titulo, descripcion, urgente);

    try {
        const res = await axios.post(
            "http://localhost:4000/api/cotizaciones/crear",
            data
        );

        if (res.status == 201) {
            alert("Cotización enviada correctamente.");
            event.target.reset();
        }
    } catch (error) {
        console.error(error.message);
        alert(
            "Error al enviar su cotización, por favor trate nuevamente o comuniquese con el soporte técnico."
        );
    }
};

const AgregarCotizacion = () => {
    return (
        <div className="container d-flex align-items-center justify-content-center">
            <div className="card p-4 shadow-lg w-50">
                <h3 className="text-center section-title">
                    Agregar Cotización
                </h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="titulo" className="form-label">
                            Titulo
                        </label>
                        <input
                            type="text"
                            className="form_input"
                            id="titulo"
                            name="titulo"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="descripcion" className="form-label">
                            Descripción
                        </label>
                        <textarea
                            name="descripcion"
                            className="form_input"
                            id="descripcion"
                            rows={5}
                            placeholder="Describa su solicitud"
                            required
                        ></textarea>
                    </div>
                    <div className="mb-3 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="urgente"
                            name="urgente"
                        />
                        <label className="form-check-label" htmlFor="urgente">
                            Urgente
                        </label>
                    </div>
                    <button type="submit" className="thm-btn">
                        Enviar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AgregarCotizacion;
