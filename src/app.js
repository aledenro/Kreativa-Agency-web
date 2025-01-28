require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const connectDB = require("./config/dbConnection");

const serviciosRoutes = require("./routes/serviciosRoutes");

connectDB();

app.use(express.json());

app.use("/api/servicios", serviciosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
