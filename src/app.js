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
const proyectosRoutes = require("./routes/proyectoRoutes");
const tareasRoutes = require("./routes/tareasRoutes");
const fileManagementRoutes = require("./routes/fileManagementRoutes");
const PTORoutes = require("./routes/PTORoutes");
const emailRoutes = require("./routes/emailRoutes");

connectDB();

app.use(
    cors({
        origin: "http://localhost:5173",
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
app.use("/api/proyectos", proyectosRoutes);
app.use("/api/tareas", tareasRoutes);
app.use("/api", usuarioRoutes);
app.use("/api/pto", PTORoutes);
app.use("/api/email", emailRoutes);

//end point aws s3
app.use("/api/fileManagement", fileManagementRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
