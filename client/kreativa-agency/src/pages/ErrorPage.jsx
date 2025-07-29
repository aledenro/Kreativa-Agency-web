import React from "react";

const ErrorPage = () => {
    return (
        <div className="error-container">
            <div className="error-logo">
                <img src="src/assets/img/logo.png" alt="Logo" />
            </div>
            <div className="error-content">
                <h1>401</h1>
                <p>Oops! Pagina căutată nu există.</p>
                <a href="#" className="btn btn-primary">
                    Acasă
                </a>
            </div>
        </div>
    );
};

export default ErrorPage;
