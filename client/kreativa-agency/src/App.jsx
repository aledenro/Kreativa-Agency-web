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
import VerMiPTO from "./pages/VerMiPTO";
import ErrorPage from "./pages/ErrorPage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { useSessionPing } from "./hooks/useSessionPingHook";
const SessionManager = ({ children }) => {
  useSessionPing();
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <SessionManager>
          <Routes>
            {/* Rutas de Administrador */}
            <Route
              path="/usuarios"
              element={
                <ProtectedRoute allowedRoles={["Administrador"]}>
                  <Usuarios />
                </ProtectedRoute>
              }
            />

            <Route
              path="/usuario/crear"
              element={
                <ProtectedRoute allowedRoles={["Administrador"]}>
                  <CrearUsuario />
                </ProtectedRoute>
              }
            />

            <Route
              path="/usuario/:id"
              element={
                <ProtectedRoute allowedRoles={["Administrador"]}>
                  <VerUsuario />
                </ProtectedRoute>
              }
            />

            <Route
              path="/usuario/editar/:id"
              element={
                <ProtectedRoute allowedRoles={["Administrador"]}>
                  <EditarUsuario />
                </ProtectedRoute>
              }
            />

            {/* Rutas de Servicios */}
            <Route
              path="/servicio/agregar"
              element={
                <ProtectedRoute allowedRoles={["Administrador"]}>
                  <AgregarServicio />
                </ProtectedRoute>
              }
            />

            <Route
              path="/servicio/modificar/:id"
              element={
                <ProtectedRoute allowedRoles={["Administrador"]}>
                  <ModificarServicio />
                </ProtectedRoute>
              }
            />

            <Route
              path="/servicio/agregarPaquete/:id"
              element={
                <ProtectedRoute allowedRoles={["Administrador"]}>
                  <AgregarPaquete />
                </ProtectedRoute>
              }
            />

            <Route
              path="/paquete/modificar/:servicioId/:paqueteId"
              element={
                <ProtectedRoute allowedRoles={["Administrador"]}>
                  <ModificarPaquete />
                </ProtectedRoute>
              }
            />

            <Route
              path="/servicios"
              element={
                <ProtectedRoute allowedRoles={["Administrador"]}>
                  <ListadoServicios />
                </ProtectedRoute>
              }
            />

            <Route path="/servicio/:id" element={<DetalleServicio />} />

            {/* Rutas de Cotizaciones */}
            <Route path="/cotizacion/agregar" element={<AgregarCotizacion />} />

            <Route
              path="/cotizacion/"
              element={
                <ProtectedRoute allowedRoles={["Administrador", "Cliente"]}>
                  <VerCotizaciones />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cotizacion/:id"
              element={
                <ProtectedRoute allowedRoles={["Administrador", "Cliente"]}>
                  <VerDetalleCotizacion />
                </ProtectedRoute>
              }
            />

            {/* Rutas Financieras */}
            <Route
              path="/egresos"
              element={
                <ProtectedRoute allowedRoles={["Administrador"]}>
                  <ListadoEgresos />
                </ProtectedRoute>
              }
            />

            <Route
              path="/ingresos"
              element={
                <ProtectedRoute allowedRoles={["Administrador"]}>
                  <ListadoIngresos />
                </ProtectedRoute>
              }
            />

            <Route
              path="/movimientos"
              element={
                <ProtectedRoute allowedRoles={["Administrador"]}>
                  <Movimientos />
                </ProtectedRoute>
              }
            />

            <Route
              path="/pagos"
              element={
                <ProtectedRoute allowedRoles={["Administrador"]}>
                  <ListadoPagos />
                </ProtectedRoute>
              }
            />

            <Route
              path="/estadisticas"
              element={
                <ProtectedRoute allowedRoles={["Administrador"]}>
                  <Estadisticas />
                </ProtectedRoute>
              }
            />

            {/* Rutas de Proyectos y Tareas */}
            <Route
              path="/proyecto/agregar"
              element={
                <ProtectedRoute allowedRoles={["Administrador"]}>
                  <AgregarProyecto />
                </ProtectedRoute>
              }
            />

            <Route
              path="/proyecto/editar/:id"
              element={
                <ProtectedRoute allowedRoles={["Administrador"]}>
                  <EditarProyecto />
                </ProtectedRoute>
              }
            />

            <Route path="/proyecto/:id" element={<VerDetalleProyecto />} />

            <Route
              path="/tarea/agregar"
              element={
                <ProtectedRoute allowedRoles={["Administrador"]}>
                  <AgregarTarea />
                </ProtectedRoute>
              }
            />

            <Route
              path="/tarea/editar/:id"
              element={
                <ProtectedRoute allowedRoles={["Administrador"]}>
                  <EditarTarea />
                </ProtectedRoute>
              }
            />

            <Route
              path="/tareas"
              element={
                <ProtectedRoute allowedRoles={["Administrador", "Colaborador"]}>
                  <ListadoTareas />
                </ProtectedRoute>
              }
            />

            {/* Rutas de Gestión de Personal */}
            <Route
              path="/jerarquia"
              element={
                <ProtectedRoute allowedRoles={["Administrador"]}>
                  <JerarquiaUsuarios />
                </ProtectedRoute>
              }
            />

            <Route
              path="/agregar-pto"
              element={
                <ProtectedRoute allowedRoles={["Administrador", "Colaborador"]}>
                  <AgregarPTO />
                </ProtectedRoute>
              }
            />

            <Route
              path="/ver-pto-empleados"
              element={
                <ProtectedRoute allowedRoles={["Administrador"]}>
                  <VerPTOEmpleados />
                </ProtectedRoute>
              }
            />

            <Route
              path="/mis-pto"
              element={
                <ProtectedRoute allowedRoles={["Administrador", "Colaborador"]}>
                  <VerMiPTO />
                </ProtectedRoute>
              }
            />

            {/* Rutas de Panel de Administración */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["Administrador"]}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/contacto"
              element={
                <ProtectedRoute allowedRoles={["Administrador"]}>
                  <RespuestasContacto />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/reclutaciones"
              element={
                <ProtectedRoute allowedRoles={["Administrador"]}>
                  <RespuestasReclutaciones />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/servicios"
              element={
                <ProtectedRoute allowedRoles={["Administrador"]}>
                  <GestionServicios />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/paquetes"
              element={
                <ProtectedRoute allowedRoles={["Administrador"]}>
                  <GestionPaquetes />
                </ProtectedRoute>
              }
            />

            {/* Rutas Públicas y de Autenticación */}
            <Route path="/login" element={<Login />} />
            <Route path="/recuperar" element={<Recuperar />} />
            <Route path="/restablecer/:token" element={<Restablecer />} />
            <Route path="/" element={<Landing />} />

            {/* Rutas de Vista de Clientes y Colaboradores */}
            <Route path="/vista-clientes" element={<VistaClientes />} />
            <Route path="/vista-colaborador" element={<VistaColaborador />} />
            <Route path="/dashboard" element={<DashboardColaborador />} />
            <Route path="/perfil" element={<VerPerfil />} />

            {/* Página de Error */}
            <Route path="/error" element={<ErrorPage />} />
          </Routes>
        </SessionManager>
      </Router>
    </AuthProvider>
  );
}

export default App;
