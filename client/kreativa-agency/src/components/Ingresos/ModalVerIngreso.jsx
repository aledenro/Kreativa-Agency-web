import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";

const ModalVerIngreso = ({ show, handleClose, ingreso, categories = [] }) => {
  // Función que busca en el array de categorías el documento cuyo _id coincida con el id recibido
  const getCategoryName = (catId) => {
    console.log("catId recibido:", catId);
    console.log("array de categorías:", categories);
    if (!catId) return "";
    const cat = categories.find((c) => c._id.toString() === catId.toString());
    console.log("Categoría encontrada:", cat);
    return cat ? cat.nombre : catId;
  };  

  return (
    <Modal show={show && ingreso && Object.keys(ingreso).length > 0} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Ver Ingreso</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>Fecha Creación:</strong>{" "}
          {new Date(ingreso.fecha_creacion).toLocaleDateString()}
        </p>
        <p>
          <strong>Nombre Cliente:</strong> {ingreso.nombre_cliente}
        </p>
        <p>
          <strong>Cédula:</strong> {ingreso.cedula}
        </p>
        <p>
          <strong>Categoría:</strong> {getCategoryName(ingreso.categoria)}
        </p>
        <p>
          <strong>Descripción:</strong> {ingreso.descripcion}
        </p>
        <p>
          <strong>Monto:</strong> ₡{ingreso.monto}
        </p>
        <p>
          <strong>Fecha Vencimiento:</strong>{" "}
          {new Date(ingreso.fecha).toLocaleDateString()}
        </p>
        <p>
          <strong>Estado:</strong> {ingreso.estado}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <button className="thm-btn-2 thm-btn-small" onClick={handleClose}>
          Cerrar
        </button>
      </Modal.Footer>
    </Modal>
  );
};

ModalVerIngreso.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  ingreso: PropTypes.shape({
    fecha_creacion: PropTypes.string,
    nombre_cliente: PropTypes.string,
    cedula: PropTypes.string,
    categoria: PropTypes.string, // Se espera que sea el id de la categoría
    descripcion: PropTypes.string,
    monto: PropTypes.number,
    fecha: PropTypes.string,
    estado: PropTypes.string,
  }).isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ModalVerIngreso;
