import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackward,
  faCaretLeft,
  faCaretRight,
  faForward,
} from "@fortawesome/free-solid-svg-icons";

const TablaPaginacion = ({
  totalItems,
  itemsPorPagina,
  paginaActual,
  onPaginaChange,
  onItemsPorPaginaChange,
}) => {
  const totalPaginas = Math.ceil(totalItems / itemsPorPagina);

  return (
    <div className="d-flex justify-content-center my-4">
      <button
        className="thm-btn btn-rosado thm-btn-small mx-2 d-none-767"
        onClick={() => onPaginaChange(1)}
        disabled={paginaActual === 1}
        style={{ height: "45px", width: "80px" }}
      >
        <FontAwesomeIcon icon={faBackward} />
      </button>

      <button
        className="thm-btn btn-rosado thm-btn-small mx-2"
        onClick={() => onPaginaChange(paginaActual - 1)}
        disabled={paginaActual === 1}
        style={{ height: "45px", width: "80px" }}
      >
        <FontAwesomeIcon icon={faCaretLeft} />
      </button>

      <span className="align-self-center mx-2 d-none-767">
        Página {paginaActual} de {totalPaginas || 1}
      </span>

      <button
        className="thm-btn btn-rosado thm-btn-small mx-2"
        onClick={() => onPaginaChange(paginaActual + 1)}
        disabled={paginaActual === totalPaginas || totalPaginas <= 1}
        style={{ height: "45px", width: "80px" }}
      >
        <FontAwesomeIcon icon={faCaretRight} />
      </button>

      <button
        className="thm-btn btn-rosado thm-btn-small mx-2 d-none-767"
        onClick={() => onPaginaChange(totalPaginas)}
        disabled={paginaActual === totalPaginas || totalPaginas <= 1}
        style={{ height: "45px", width: "80px" }}
      >
        <FontAwesomeIcon icon={faForward} />
      </button>

      <select
        className="form-select form-select-sm me-2 form_input"
        value={itemsPorPagina}
        onChange={(e) => onItemsPorPaginaChange(Number(e.target.value))}
        style={{ height: "45px", width: "80px" }}
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={totalItems}>Todos</option>
      </select>
    </div>
  );
};

export default TablaPaginacion;
