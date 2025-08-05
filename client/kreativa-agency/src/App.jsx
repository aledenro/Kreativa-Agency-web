import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import AgregarCotizacion from "./pages/AgregarCotizacion";
import ListadoEgresos from "./pages/ListadoEgresos";
import ListadoIngresos from "./pages/ListadoIngresos";
import Movimientos from "./pages/Movimientos";
import Estadisticas from "./pages/Estadisticas";
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
import ModificarPaquete from "./pages/ModificarPaquete";
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
import ListadoTareas from "./pages/ListadoTareas";
import JerarquiaUsuarios from "./pages/JerarquiaUsuarios";
import AgregarPTO from "./pages/AgregarPTO";
import VerPTOEmpleados from "./pages/VerPTOEmpleados";
import VerPerfil from "./pages/VerPerfil";
import AdminPanel from "./pages/AdminPanel";
import VerDetalleProyecto from "./pages/VerDetalleProyecto";
import Landing from "./pages/Landing";
import ListadoPagos from "./pages/ListadoPagos";
import RespuestasContacto from "./pages/RespuestasContacto";
import RespuestasReclutaciones from "./pages/RespuestasReclutaciones";
import GestionServicios from "./pages/GestionServicios";
import GestionPaquetes from "./pages/GestionPaquetes";
import DashboardColaborador from "./pages/DashboardColaborador";
import ErrorPage from "./pages/ErrorPage";

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
                    path="/paquete/modificar/:servicioId/:paqueteId"
                    element={<ModificarPaquete />}
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

                <Route path="/egresos" element={<ListadoEgresos />} />

                <Route path="/ingresos" element={<ListadoIngresos />} />

                <Route path="/movimientos" element={<Movimientos />} />

                {/* <Route path="/egresos" element={<VerEgresos />}></Route> */}
                {/* <Route
                    path="/egreso/editar/:id"
                    element={<EditarEgreso />}
                ></Route> */}

                {/* <Route path="/ingresos" element={<ListadoIngresos />} /> */}

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
                <Route path="/estadisticas" element={<Estadisticas />} />

                <Route path="/admin" element={<AdminPanel />}></Route>
                <Route path="/" element={<Landing />} />
                <Route path="/pagos" element={<ListadoPagos />} />
                <Route
                    path="/admin/contacto"
                    element={<RespuestasContacto />}
                />
                <Route
                    path="/admin/reclutaciones"
                    element={<RespuestasReclutaciones />}
                />
                <Route
                    path="/admin/reclutaciones"
                    element={<RespuestasReclutaciones />}
                />
                <Route path="/admin/servicios" element={<GestionServicios />} />
                <Route path="/admin/paquetes" element={<GestionPaquetes />} />
                <Route path="/dashboard" element={<DashboardColaborador />} />
                <Route path="/error" element={<ErrorPage />} />
            </Routes>
        </Router>
    );
}

export default App;
