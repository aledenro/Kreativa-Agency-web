import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import AgregarCotizacion from "./pages/AgregarCotizacion";
import AgregarEgreso from "./pages/AgregarEgreso";
import ObtenerEgresos from "./pages/ObtenerEgresos";
import EditarEgreso from "./pages/EditarEgreso";
import VerCotizaciones from "./pages/verCotizaciones";
import VerDetalleCotizacion from "./pages/VerDetalleCotizacion";
import CrearUsuario from "./pages/CrearUsuario";
import Usuarios from "./pages/Usuarios";
import VerUsuario from "./pages/VerUsuario";
import EditarUsuario from "./pages/EditarUsuario";
import AgregarServicio from "./pages/AgregarServicio";
import ModificarServicio from "./pages/ModificarServicio";
import AgregarPaquete from "./pages/AgregarPaquete";
import AgregarProyecto from "./pages/AgregarProyecto";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/usuarios" element={<Usuarios />}></Route>

                <Route path="/usuario/crear" element={<CrearUsuario />}></Route>

                <Route path="/usuario/:id" element={<VerUsuario />}></Route>

                <Route
                    path="/usuario/editar/:id"
                    element={<EditarUsuario />}
                ></Route>

                <Route
                    path="/servicio/agregar"
                    element={<AgregarServicio />}
                ></Route>
                <Route
                    path="/servicio/modificar/:id"
                    element={<ModificarServicio />}
                ></Route>
                <Route
                    path="/servicio/agregarPaquete/:id"
                    element={<AgregarPaquete />}
                ></Route>

                <Route
                    path="/cotizacion/agregar"
                    element={<AgregarCotizacion />}
                ></Route>
                <Route
                    path="/cotizacion/"
                    element={<VerCotizaciones />}
                ></Route>
                <Route
                    path="/cotizacion/:id"
                    element={<VerDetalleCotizacion />}
                ></Route>
                <Route
                    path="/egreso/agregar"
                    element={<AgregarEgreso />}
                ></Route>
                <Route path="/egresos" element={<ObtenerEgresos />}></Route>
                <Route
                    path="/egreso/editar/:id"
                    element={<EditarEgreso />}
                ></Route>
                <Route
                    path="/servicio/agregar"
                    element={<AgregarServicio />}
                ></Route>
                <Route
                    path="/servicio/modificar/:id"
                    element={<ModificarServicio />}
                ></Route>
                <Route
                    path="/proyecto/agregar"
                    element={<AgregarProyecto />}
                ></Route>
            </Routes>
        </Router>
    );
}

export default App;
