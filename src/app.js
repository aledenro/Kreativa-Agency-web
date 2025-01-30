require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const connectDB = require("./config/dbConnection");

//importar las rutas
const cotizacionesRoutes = require("./routes/cotizacionesRoutes");

connectDB();

app.use(express.json());
//rutas de enpoints
app.use("/api/cotizaciones", cotizacionesRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
