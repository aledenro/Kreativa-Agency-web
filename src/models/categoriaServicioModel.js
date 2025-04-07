const mongoose = require("mongoose");

const CategoriaServicioModel = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
        },
    },
    { collection: "categorias_servicio" }
);

module.exports = mongoose.model("categorias_servicio", CategoriaServicioModel);
