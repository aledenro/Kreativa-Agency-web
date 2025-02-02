import React, { useState, useEffect } from "react";
import { Form, Alert } from "react-bootstrap";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

const ModificarServicio = () => {
  const { id } = useParams();
  const [servicio, setServicio] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("danger");

  useEffect(() => {
    const fetchServicio = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/servicios/${id}`
        );
        setServicio(res.data);
      } catch (error) {
        console.error("Error al obtener el servicio: ", error.message);
        setAlertMessage("No se pudo cargar la informacion del servicio");
        setAlertVariant("danger");
        setShowAlert(true);
      }
    };

    fetchServicio();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServicio((prevServicio) => ({ ...prevServicio, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!servicio.nombre || !servicio.descripcion || !servicio.categoria) {
      setAlertMessage("Todos los campos son obligatorios");
      setAlertVariant("danger");
      setShowAlert(true);
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:4000/api/servicios/modificar/${id}`,
        servicio
      );
      console.log(res.data);
      setAlertMessage("Servicio modificado exitosamente");
      setAlertVariant("success");
      setShowAlert(true);
    } catch (error) {
      console.error("Error al modificar el servicio: ", error.message);
      setAlertMessage("Hubo un error al modificar el servicio");
      setAlertVariant("danger");
      setShowAlert(true);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="section-title text-center">
          <h2>Modificar Servicio</h2>
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
            <Form onSubmit={handleSubmit} className="servicio_form">
              <div className="row">
                <div className="">
                  <input
                    type="text"
                    placeholder="Nombre del servicio"
                    name="nombre"
                    className="form_input"
                    value={servicio.nombre}
                    onChange={handleChange}
                  />
                </div>
                <div className="col">
                  <input
                    type="text"
                    placeholder="Categoria"
                    name="categoria"
                    className="form_input"
                    value={servicio.categoria}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <input
                    type="text"
                    name="descripcion"
                    placeholder="Descripcion"
                    className="form_input"
                    value={servicio.descripcion}
                    onChange={handleChange}
                  />
                  <div className="d-flex justify-content-center mt-3">
                    <button type="submit" className="thm-btn form-btn">
                      Modificar
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModificarServicio;
