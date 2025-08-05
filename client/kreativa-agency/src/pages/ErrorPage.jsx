import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

const ErrorPage = () => {
    const { state } = useLocation();
    const { errorCode = "Error", mensaje = "Ha ocurrido algo" } = state || {};

    return (
        <div className="error-container">
            <div className="error-logo">
                <img src="src/assets/img/logo.png" alt="Logo" />
            </div>
            <div className="error-content">
                <h1>{errorCode}</h1>
                <p>{mensaje}</p>
                <a href="/" className="btn thm-btn">
                    Ir a la Página Principal
                </a>
            </div>
        </div>
    );
};

ErrorPage.propTypes = {
    errorCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    mensaje: PropTypes.string.isRequired,
};

export default ErrorPage;
