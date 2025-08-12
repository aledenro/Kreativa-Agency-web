require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const connectDB = require("./config/dbConnection");
const cors = require("cors");

const serviciosRoutes = require("./routes/serviciosRoutes");
const cotizacionesRoutes = require("./routes/cotizacionesRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const egresosRoutes = require("./routes/egresosRoutes");
const ingresosRoutes = require("./routes/ingresosRoutes");
const movimientosRoutes = require("./routes/movimientosRoutes");
const proyectosRoutes = require("./routes/proyectoRoutes");
const tareasRoutes = require("./routes/tareasRoutes");
const fileManagementRoutes = require("./routes/fileManagementRoutes");
const PTORoutes = require("./routes/PTORoutes");
const emailRoutes = require("./routes/emailRoutes");
const reclutacionesRoutes = require("./routes/reclutacionesRoutes");
const contactoRoutes = require("./routes/contactoRoutes");
const pagosRoutes = require("./routes/pagosRoutes");
const configRoutes = require("./routes/configRoutes");
const sessionRoutes = require("./routes/sessionsRoutes")

app.get('/health', (req, res) => res.send('ok'));

connectDB();

app.use(
    cors({
        origin: process.env.ORIGIN,
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//rutas de enpoints
app.use("/api/cotizaciones", cotizacionesRoutes);
app.use("/api/servicios", serviciosRoutes);
app.use("/api/egresos", egresosRoutes);
app.use("/api/ingresos", ingresosRoutes);
app.use("/api/movimientos", movimientosRoutes);
app.use("/api/proyectos", proyectosRoutes);
app.use("/api/tareas", tareasRoutes);
app.use("/api", usuarioRoutes);
app.use("/api/pto", PTORoutes);
app.use("/api/email", emailRoutes);
app.use("/api/reclutaciones", reclutacionesRoutes);
app.use("/api/contacto", contactoRoutes);
app.use("/api/pagos", pagosRoutes);
app.use("/api/form-status", configRoutes);
app.use("/api/sessions", sessionRoutes);


//end point aws s3
app.use("/api/fileManagement", fileManagementRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`CORS origin configurado para: ${process.env.ORIGIN}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`MONGO URL: ${process.env.MONGO_URL}`)
});
