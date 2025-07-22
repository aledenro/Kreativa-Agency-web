import { Modal, Alert, Form } from "react-bootstrap";
import PropTypes from "prop-types";
import { useState } from "react";
import axios from "axios";

const ModalCrearIngreso = ({ show, handleClose, categories, onSave }) => {
  const [mensaje, setMensaje] = useState("");
  const [errorCedula, setErrorCedula] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [emailCliente, setEmailCliente] = useState("");
  const [formData, setFormData] = useState({
    cedula: "",
    categoria: "",
    monto: "",
    descripcion: "",
    estado: "Pendiente de pago",
    fecha: "",
  });

  const validarCedula = (cedula) => /^[0-9]{8,9}$/.test(cedula);
  const [estadoCliente, setEstadoCliente] = useState("Activo");

  const buscarNombreCliente = async () => {
    if (!formData.cedula.trim()) return;
    if (!validarCedula(formData.cedula)) {
      setErrorCedula("La cédula debe tener entre 8 y 9 dígitos.");
      return;
    }

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/ingresos/buscarPorCedula/${formData.cedula}`);
      if (res.data) {
        setNombreCliente(res.data.nombre);
        setEmailCliente(res.data.email);
        setEstadoCliente(res.data.estado || "Inactivo");

        if (res.data.estado !== "Activo") {
          setErrorCedula("El cliente está inactivo.");
        } else {
          setErrorCedula("");
        }
      } else {
        setNombreCliente("");
        setEmailCliente("");
        setEstadoCliente("Inactivo");
        setErrorCedula("Cliente no encontrado");
      }
    } catch (error) {
      console.error("Error buscando cliente:", error);
      setNombreCliente("");
      setEmailCliente("");
      setEstadoCliente("Inactivo");
      setErrorCedula("Error al buscar cliente");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/ingresos`, formData);
      if (res.status === 201) {
        setMensaje("Ingreso creado exitosamente.");
        setTimeout(() => {
          setMensaje("");
          onSave && onSave();
          handleClose();
        }, 1500);
      }
    } catch (error) {
      console.error("Error creando ingreso:", error.message);
      setMensaje("Error al crear el ingreso.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Crear Ingreso</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          {mensaje && <Alert variant="info">{mensaje}</Alert>}
          <div className="mb-3">
            <label>Cédula:</label>
            <input
              type="text"
              name="cedula"
              className="form_input"
              value={formData.cedula}
              onChange={(e) => {
                handleChange(e);
                setNombreCliente("");
              }}
              onBlur={buscarNombreCliente}
              required
            />
            {errorCedula && <small className="text-danger">{errorCedula}</small>}
          </div>
          <div className="mb-3">
            <label>Nombre del Cliente:</label>
            <input
              type="text"
              className="form_input"
              value={nombreCliente}
              readOnly
              placeholder="Se autocompleta si la cédula es válida"
            />
          </div>
          <div className="mb-3">
            <label>Email:</label>
            <input
              type="text"
              className="form_input"
              value={emailCliente}
              readOnly
              placeholder="Se autocompleta si la cédula es válida"
            />
          </div>
          <div className="mb-3">
            <label>Categoría:</label>
            <Form.Select name="categoria" value={formData.categoria} onChange={handleChange} required>
              <option value="">Seleccione una categoría</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.nombre}
                </option>
              ))}
            </Form.Select>
          </div>
          <div className="mb-3">
            <label>Monto:</label>
            <input type="number" name="monto" className="form_input" value={formData.monto} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Descripción:</label>
            <input type="text" name="descripcion" className="form_input" value={formData.descripcion} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Estado:</label>
            <Form.Select name="estado" value={formData.estado} onChange={handleChange} required>
              <option value="Pendiente de pago">Pendiente de pago</option>
              <option value="Pagado">Pagado</option>
            </Form.Select>
          </div>
          <div className="mb-3">
            <label>Fecha Vencimiento:</label>
            <input type="date" name="fecha" className="form_input" value={formData.fecha} onChange={handleChange} required />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="thm-btn thm-btn-small btn-gris mx-1" onClick={handleClose}>
            Cancelar
          </button>
          <button type="submit" className="thm-btn thm-btn-small" disabled={estadoCliente !== "Activo"}>
            Crear
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

ModalCrearIngreso.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
  onSave: PropTypes.func,
};

export default ModalCrearIngreso;
