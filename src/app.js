require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const connectDB = require("./config/dbConnection");
const usuarioRoutes = require('./routes/usuarioRoutes');

connectDB();

app.use(express.json());
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
app.use('/api', usuarioRoutes);