import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import AgregarCotizacion from "./pages/AgregarCotizacion";
import AgregarServicio from "./pages/AgregarServicio";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/cotizacion/agregar"
          element={<AgregarCotizacion />}
        ></Route>
        <Route path="/servicio/agregar" element={<AgregarServicio />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
