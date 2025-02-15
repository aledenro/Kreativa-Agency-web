import React, { useState, useEffect } from "react";
import { Form, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

const AgregarPaquete = () => {
    const { id } = useParams();
    const [paquete, setPaquete] = useState({
        nombre: "",
        descripcion: "",
        nivel: "",
        duracion: "",
        beneficios: [""],
        precio: "",
    });
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState("danger");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaquete((prevPaquete) => ({ ...prevPaquete, [name]: value }));
    };

    const handleBeneficioChange = (index, value) => {
        const nuevosBeneficios = [...paquete.beneficios];
        nuevosBeneficios[index] = value;
        setPaquete((prevPaquete) => ({
            ...prevPaquete,
            beneficios: nuevosBeneficios,
        }));
    };

    const agregarBeneficio = () => {
        setPaquete((prevPaquete) => ({
            ...prevPaquete,
            beneficios: [...prevPaquete.beneficios, ""],
        }));
    };

    const eliminarBeneficio = (index) => {
        const nuevosBeneficios = paquete.beneficios.filter(
            (_, i) => i !== index
        );
        setPaquete((prevPaquete) => ({
            ...prevPaquete,
            beneficios: nuevosBeneficios,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (
            !paquete.nombre ||
            !paquete.descripcion ||
            !paquete.nivel ||
            !paquete.duracion ||
            !paquete.precio
        ) {
            setAlertMessage("Todos los campos son obligatorios");
            setAlertVariant("danger");
            setShowAlert(true);
            return;
        }

        const paqueteData = {
            ...paquete,
            precio: parseFloat(paquete.precio),
        };

        try {
            const res = await axios.put(
                `http://localhost:4000/api/servicios/${id}/nuevoPaquete`,
                paqueteData
            );
            console.log(res.data);
            setAlertMessage("Paquete agregado exitosamente");
            setAlertVariant("success");
            setShowAlert(true);
        } catch (error) {
            console.error("Error al agregar el paquete: ", error.message);
            setAlertMessage("Hubo un error al agregar el paquete");
            setAlertVariant("danger");
            setShowAlert(true);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container">
                <div className="section-title text-center">
                    <h2>Agregar Paquete</h2>
                </div>
                <div className="mx-auto align-items-center justify-content-center d-flex">
                    <div className="col-xl-8">
                        {showAlert && (
                            <Alert
                                variant={alertVariant}
                                onClose={() => setShowAlert(false)}
                                dismissible
                            >
                                {alertMessage}
                            </Alert>
                        )}
                        <Form onSubmit={handleSubmit} className="paquete_form">
                            <div className="row">
                                <div className="col">
                                    <label
                                        htmlFor="descripcion"
                                        className="form-label"
                                    >
                                        Nombre del paquete
                                    </label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        className="form_input"
                                        value={paquete.nombre}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col">
                                    <label
                                        htmlFor="descripcion"
                                        className="form-label"
                                    >
                                        Nivel
                                    </label>
                                    <input
                                        type="text"
                                        name="nivel"
                                        className="form_input"
                                        value={paquete.nivel}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <label
                                        htmlFor="descripcion"
                                        className="form-label"
                                    >
                                        Duración
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="1 mes, 15 días..."
                                        name="duracion"
                                        className="form_input"
                                        value={paquete.duracion}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col">
                                    <label
                                        htmlFor="descripcion"
                                        className="form-label"
                                    >
                                        Precio
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="$"
                                        name="precio"
                                        className="form_input"
                                        value={paquete.precio}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <label
                                        htmlFor="descripcion"
                                        className="form-label"
                                    >
                                        Descripción
                                    </label>
                                    <textarea
                                        placeholder="Describa la información del paquete aquí..."
                                        name="descripcion"
                                        className="form_input"
                                        rows="3"
                                        value={paquete.descripcion}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <label htmlFor="" className="form-label">
                                        Beneficios
                                    </label>
                                    {paquete.beneficios.map(
                                        (beneficio, index) => (
                                            <div
                                                key={index}
                                                className="d-flex align-items-center mb-2"
                                            >
                                                <input
                                                    type="text"
                                                    placeholder={`Beneficio ${
                                                        index + 1
                                                    }`}
                                                    className="form_input"
                                                    value={beneficio}
                                                    onChange={(e) => {
                                                        handleBeneficioChange(
                                                            index,
                                                            e.target.value
                                                        );
                                                        if (
                                                            index ===
                                                                paquete
                                                                    .beneficios
                                                                    .length -
                                                                    1 &&
                                                            e.target.value !==
                                                                ""
                                                        ) {
                                                            agregarBeneficio();
                                                        }
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    className="icon-btn"
                                                    onClick={() =>
                                                        eliminarBeneficio(index)
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faX}
                                                    />
                                                </button>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                            <div className="d-flex justify-content-center mt-3">
                                <button
                                    type="submit"
                                    className="thm-btn form-btn"
                                >
                                    Agregar
                                </button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgregarPaquete;
