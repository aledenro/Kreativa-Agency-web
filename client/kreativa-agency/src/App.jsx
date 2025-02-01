import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import AgregarCotizacion from "./pages/AgregarCotizacion";
import CrearUsuario from "./pages/CrearUsuario";
import Usuarios from "./pages/Usuarios";
import VerUsuario from "./pages/VerUsuario";
import EditarUsuario from "./pages/EditarUsuario";

function App() {
    return (
        <Router>
            <Routes>
                {/* Ruta para gestionar usuarios */}
                <Route path="/usuarios" element={<Usuarios />} />

                {/* Ruta para crear un nuevo usuario */}
                <Route path="/usuario/crear" element={<CrearUsuario />} />

                {/* Ruta para ver detalles de un usuario */}
                <Route path="/usuario/:id" element={<VerUsuario />} />

                {/* Ruta para editar un usuario */}
                <Route path="/usuario/editar/:id" element={<EditarUsuario />} />

                {/* Ruta existente para agregar cotización */}
                <Route
                    path="/cotizacion/agregar"
                    element={<AgregarCotizacion />}
                ></Route>
            </Routes>
        </Router>
    );
}

export default App;