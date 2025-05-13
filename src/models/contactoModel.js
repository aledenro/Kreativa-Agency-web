const mongoose = require("mongoose");

const ContactoModel = new mongoose.Schema({
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
    nombre_negocio: {
        type: String,
        required: true,
    },
    dedicacion_negocio: {
        type: String,
        required: true,
    },
    link_sitio_web: {
        type: String,
        required: false,
    },
    redes_sociales: {
        type: [String],
        default: [],
    },
    objetivos: {
        type: String,
        required: false,
    },
    servicios_id: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "servicios",
            required: true,
        },
    ],
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

module.exports = mongoose.model("formularios_contacto", ContactoModel);
