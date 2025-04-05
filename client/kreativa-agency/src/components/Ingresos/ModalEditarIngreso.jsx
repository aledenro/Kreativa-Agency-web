import { Modal, Alert, Form, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import axios from "axios";

const ModalEditarIngreso = ({ show, handleClose, ingreso, categories, onSave }) => {
  const [ingresoEditado, setIngresoEditado] = useState({});
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (ingreso && Object.keys(ingreso).length > 0) {
      setIngresoEditado(ingreso);
    }
  }, [ingreso]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIngresoEditado((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:4000/api/ingresos/${ingresoEditado._id}`, ingresoEditado);
      if (res.status === 200) {
        setMensaje("Ingreso actualizado exitosamente");
        setTimeout(() => {
          setMensaje("");
          onSave && onSave(ingresoEditado);
          handleClose();
        }, 1500);
      }
    } catch (error) {
      console.error("Error al actualizar el ingreso:", error.message);
      setMensaje("Error al actualizar el ingreso.");
    }
  };

  return (
    <Modal show={show && ingresoEditado && Object.keys(ingresoEditado).length > 0} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Ingreso</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          {mensaje && <Alert variant="info">{mensaje}</Alert>}
          <div className="mb-3">
            <label>Fecha Creación:</label>
            <input
              type="text"
              className="form_input"
              value={new Date(ingresoEditado.fecha_creacion).toLocaleDateString()}
              disabled
            />
          </div>
          <div className="mb-3">
            <label>Nombre Cliente:</label>
            <input type="text" className="form_input" value={ingresoEditado.nombre_cliente} disabled />
          </div>
          <div className="mb-3">
            <label>Cédula:</label>
            <input type="text" className="form_input" value={ingresoEditado.cedula} disabled />
          </div>
          <div className="mb-3">
            <label>Categoría:</label>
            <Form.Select name="categoria" value={ingresoEditado.categoria} onChange={handleChange} required>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.nombre}
                </option>
              ))}
            </Form.Select>
          </div>
          <div className="mb-3">
            <label>Descripción:</label>
            <input type="text" name="descripcion" className="form_input" value={ingresoEditado.descripcion} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Monto:</label>
            <input type="number" name="monto" className="form_input" value={ingresoEditado.monto} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Fecha Vencimiento:</label>
            <input
              type="date"
              name="fecha"
              className="form_input"
              value={ingresoEditado.fecha ? new Date(ingresoEditado.fecha).toISOString().split("T")[0] : ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Estado:</label>
            <Form.Select name="estado" value={ingresoEditado.estado} onChange={handleChange} required>
              <option value="Pendiente de pago">Pendiente de pago</option>
              <option value="Pagado">Pagado</option>
            </Form.Select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="thm-btn-2 thm-btn-small" onClick={handleClose}>
            Cancelar
          </button>
          <button type="submit" className="thm-btn thm-btn-small">
            Guardar Cambios
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

ModalEditarIngreso.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  ingreso: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  onSave: PropTypes.func,
};

export default ModalEditarIngreso;
