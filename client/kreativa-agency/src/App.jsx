import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import AgregarCotizacion from "./pages/AgregarCotizacion";
import AgregarEgreso from "./pages/AgregarEgreso";
import VerEgresos from "./pages/VerEgresos";
import EditarEgreso from "./pages/EditarEgreso";
import VerIngresos from "./pages/VerIngresos";
import AgregarIngreso from "./pages/AgregarIngreso";
import EditarIngreso from "./pages/EditarIngreso";
import VerCotizaciones from "./pages/verCotizaciones";
import VerDetalleCotizacion from "./pages/VerDetalleCotizacion";
import CrearUsuario from "./pages/CrearUsuario";
import Usuarios from "./pages/Usuarios";
import VerUsuario from "./pages/VerUsuario";
import EditarUsuario from "./pages/EditarUsuario";
import ListadoServicios from "./pages/ListadoServicios";
import AgregarServicio from "./pages/AgregarServicio";
import ModificarServicio from "./pages/ModificarServicio";
import AgregarPaquete from "./pages/AgregarPaquete";
import DetalleServicio from "./pages/DetalleServicio";
import AgregarProyecto from "./pages/AgregarProyecto";
import EditarProyecto from "./pages/EditarProyecto";
import AgregarTarea from "./pages/AgregarTarea";
import EditarTarea from "./pages/EditarTarea";
import Login from "./pages/Login";
import VistaClientes from "./pages/VistaClientes";
import VistaColaborador from "./pages/VistaColaborador";
import Recuperar from "./pages/Recuperar";
import Restablecer from "./pages/Restablecer";
import RestablecerContraseña from "./pages/RestablecerContraseña";
import ListadoTareas from "./pages/ListadoTareas";
import JerarquiaUsuarios from "./pages/JerarquiaUsuarios";
import AgregarPTO from "./pages/AgregarPTO";
import VerPTOEmpleados from "./pages/VerPTOEmpleados";
import VerPerfil from "./pages/VerPerfil";
import AdminPanel from "./pages/AdminPanel";
import VerDetalleProyecto from "./pages/VerDetalleProyecto";
import Landing from "./pages/Landing";
import ListadoPagos from "./pages/ListadoPagos";
import FormContacto from "./pages/FormContacto";

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
                <Route path="/egresos" element={<VerEgresos />}></Route>
                <Route
                    path="/egreso/editar/:id"
                    element={<EditarEgreso />}
                ></Route>
                <Route path="/ingreso/agregar" element={<AgregarIngreso />} />
                <Route path="/ingresos" element={<VerIngresos />} />
                <Route path="/ingreso/editar/:id" element={<EditarIngreso />} />

                <Route path="/servicios" element={<ListadoServicios />}></Route>

                <Route
                    path="/servicio/agregar"
                    element={<AgregarServicio />}
                ></Route>
                <Route
                    path="/servicio/modificar/:id"
                    element={<ModificarServicio />}
                ></Route>
                <Route
                    path="/servicio/:id"
                    element={<DetalleServicio />}
                ></Route>
                <Route
                    path="/proyecto/agregar"
                    element={<AgregarProyecto />}
                ></Route>
                <Route
                    path="/proyecto/editar/:id"
                    element={<EditarProyecto />}
                ></Route>
                <Route path="/tarea/agregar" element={<AgregarTarea />}></Route>
                <Route
                    path="/tarea/editar/:id"
                    element={<EditarTarea />}
                ></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route
                    path="/vista-clientes"
                    element={<VistaClientes />}
                ></Route>
                <Route
                    path="/vista-colaborador"
                    element={<VistaColaborador />}
                ></Route>
                <Route path="/recuperar" element={<Recuperar />}></Route>
                <Route
                    path="/restablecer/:token"
                    element={<Restablecer />}
                ></Route>
                <Route
                    path="/restablecer/:token"
                    element={<RestablecerContraseña />}
                ></Route>
                <Route path="/tareas" element={<ListadoTareas />}></Route>
                <Route
                    path="/jerarquia"
                    element={<JerarquiaUsuarios />}
                ></Route>
                <Route path="/agregar-pto" element={<AgregarPTO />}></Route>
                <Route
                    path="/ver-pto-empleados"
                    element={<VerPTOEmpleados />}
                ></Route>
                <Route path="/perfil" element={<VerPerfil />}></Route>
                <Route
                    path="/proyecto/:id"
                    element={<VerDetalleProyecto />}
                ></Route>
                <Route path="/admin" element={<AdminPanel />}></Route>
                <Route path="/" element={<Landing />} />
                <Route path="/pagos" element={<ListadoPagos />} />
                <Route path="/" element={<FormContacto />} />
            </Routes>
        </Router>
    );
}

export default App;
