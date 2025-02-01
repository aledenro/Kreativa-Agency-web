require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const connectDB = require("./config/dbConnection");
const cors = require("cors");

const serviciosRoutes = require("./routes/serviciosRoutes");
const cotizacionesRoutes = require("./routes/cotizacionesRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");

connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

//rutas de enpoints
app.use("/api/cotizaciones", cotizacionesRoutes);
app.use("/api/servicios", serviciosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
app.use("/api", usuarioRoutes);
