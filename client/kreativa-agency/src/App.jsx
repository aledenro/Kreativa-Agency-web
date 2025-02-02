import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import AgregarCotizacion from "./pages/AgregarCotizacion";
import AgregarEgreso from "./pages/AgregarEgreso";

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
            </Routes>
        </Router>
    );
}

export default App;
