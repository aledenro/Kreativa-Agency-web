const mongoose = require("mongoose");

const ReclutacionesModel = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    apellido: {
        type: String,
        required: true,
    },
    correo: {
        type: String,
        required: true,
    },
    telefono: {
        type: String,
        required: true,
    },
    fecha_envio: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    activo: {
        type: Boolean,
        default: true,
        required: true,
    },
});

module.exports = mongoose.model(
    "formularios_reclutamiento",
    ReclutacionesModel
);
