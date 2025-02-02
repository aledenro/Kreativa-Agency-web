import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import AgregarCotizacion from "./pages/AgregarCotizacion";
import AgregarEgreso from "./pages/AgregarEgreso";
import ObtenerEgresos from "./pages/ObtenerEgresos";
import EditarEgreso from "./pages/EditarEgreso";

function App() {
    return (
        <Router>
            <Routes>
                <Route
                    path="/cotizacion/agregar"
                    element={<AgregarCotizacion />}
                ></Route>
                <Route
                    path="/egreso/agregar"
                    element={<AgregarEgreso />}
                ></Route>
                <Route
                    path="/egresos"
                    element={<ObtenerEgresos />}
                ></Route>
                <Route path="/egreso/editar/:id"
                element={<EditarEgreso />}
                ></Route>
            </Routes>
        </Router>
    );
}

export default App;
