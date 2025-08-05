import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

const ErrorPage = () => {
    const { state } = useLocation();
    const { errorCode = "Error", mensaje = "Ha ocurrido algo" } = state || {};

    return (
        <div className="error-container d-flex flex-column justify-content-center align-items-center vh-100">
            <div className="error-logo mb-4">
                <img
                    src="src/assets/img/logo.png"
                    alt="Logo"
                    className="img-fluid"
                />
            </div>

            <div className="error-content text-center">
                <h1 className="display-1 mb-3">{errorCode}</h1>
                <p className="fs-4 mb-4">{mensaje}</p>
                <a href="/" className="btn thm-btn btn-lg">
                    Ir a la Página Principal
                </a>
            </div>
        </div>
    );
};

ErrorPage.propTypes = {
    errorCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    mensaje: PropTypes.string,
};

export default ErrorPage;
