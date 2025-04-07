const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");

const printExcelRoutes = require("./routes/printExcelRoutes");

dotenv.config();

app.use(
    cors({
        origin: process.env.FRONT_END_URL,
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/printExcel", printExcelRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`);
});
