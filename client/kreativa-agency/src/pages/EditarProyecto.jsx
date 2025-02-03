import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";

const id = "67a043437b55c4040e008b3b";

function construirJsonRequest(
    nombre,
    descripcion,
    cliente,
    urgente,
    fechaEntrega
) {
    return {
        cliente_id: cliente,
        nombre: nombre,
        descripcion: descripcion,
        urgente: urgente,
        fecha_entrega: fechaEntrega,
    };
}

const handleSubmit = async (event) => {
    event.preventDefault();

    const enviar = confirm("¿Desea editar el proyecto?");

    if (!enviar) {
        return;
    }

    const formData = new FormData(event.target);

    const nombre = formData.get("nombre");
    const descripcion = formData.get("descripcion");
    const cliente = formData.get("cliente");
    const urgente = formData.get("urgente") === "on";
    const fechaEntrega = formData.get("fecha_entrega");

    const data = construirJsonRequest(
        nombre,
        descripcion,
        cliente,
        urgente,
        fechaEntrega
    );

    try {
        const res = await axios.put(
            `http://localhost:4000/api/proyectos/editar/67a043437b55c4040e008b3b`,
            data
        );

        if (res.status == 200) {
            alert("Proyecto editado correctamente.");
        }
    } catch (error) {
        console.error(error.message);
        alert(
            "Error al editar su proyecto, por favor trate nuevamente o comuniquese con el soporte técnico."
        );
    }
};

function renderOptionsClientes(cliente, clienteProyecto) {
    if (cliente._id === clienteProyecto._id) {
        return (
            <option key={cliente._id} value={cliente._id} selected>
                {cliente.nombre}
            </option>
        );
    } else {
        return (
            <option key={cliente._id} value={cliente._id}>
                {cliente.nombre}
            </option>
        );
    }
}

const AgregarProyecto = () => {
    const [clientes, setClientes] = useState([]);
    const [proyecto, setProyecto] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProyecto((prevProyecto) => ({ ...prevProyecto, [name]: value }));
    };

    const handleChangeCheckBox = (e) => {
        const { name, checked } = e.target;
        setProyecto((prevProyecto) => ({ ...prevProyecto, [name]: checked }));
    };

    useEffect(() => {
        async function fetchClientes() {
            try {
                const response = await axios.get(
                    "http://localhost:4000/api/usuarios/clientes"
                );

                setClientes(response.data);
            } catch (error) {
                console.error(
                    `Error al obtener los clientes: ${error.message}`
                );
            }
        }

        async function fetchProyecto() {
            try {
                const response = await axios.get(
                    `http://localhost:4000/api/proyectos/id/${id}`
                );

                if (response.status === 200) {
                    setProyecto(response.data);
                }
            } catch (error) {
                console.error(`Error al obtener el proyecto: ${error.message}`);
            }
        }

        fetchClientes();
        fetchProyecto();
    }, []);

    if (!proyecto) {
        return (
            <div className="container d-flex align-items-center justify-content-center">
                <p>Cargando proyecto...</p>
            </div>
        );
    }

    return (
        <div>
            <Navbar></Navbar>
            <div className="container d-flex align-items-center justify-content-center">
                <div className="card p-4 shadow-lg w-50">
                    <h3 className="text-center section-title">
                        Editar Proyecto
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="nombre" className="form-label">
                                Nombre
                            </label>
                            <input
                                type="text"
                                className="form_input"
                                id="nombre"
                                name="nombre"
                                required
                                value={proyecto.nombre}
                                onChange={handleChange}
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
                                value={proyecto.descripcion}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="cliente" className="form-label">
                                Cliente
                            </label>
                            <select
                                className="form-select"
                                name="cliente"
                                id="cliente"
                                onChange={handleChange}
                            >
                                {clientes.map((cliente) =>
                                    renderOptionsClientes(
                                        cliente,
                                        proyecto.cliente_id
                                    )
                                )}
                            </select>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="mb-3 form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="urgente"
                                        name="urgente"
                                        checked={proyecto.urgente}
                                        onChange={handleChangeCheckBox}
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="urgente"
                                    >
                                        Urgente
                                    </label>
                                </div>
                            </div>
                            <div className="col">
                                <div className="mb-3">
                                    <label
                                        htmlFor="fecha_entrega"
                                        className="form-label"
                                    >
                                        Fecha de Entrega
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="fecha_entrega"
                                        name="fecha_entrega"
                                        required
                                        onChange={handleChange}
                                        value={
                                            new Date(proyecto.fecha_entrega)
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="thm-btn">
                            Enviar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AgregarProyecto;
