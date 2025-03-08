const mongoose = require("mongoose");

const ProyectoModel = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
        },
        descripcion: {
            type: String,
            required: true,
        },
        cliente_id: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "usuarios",
        },
        estado: {
            type: String,
            required: true,
            enum: [
                "Por Hacer",
                "En Progreso",
                "Cancelado",
                "Finalizado",
                "En Revisión",
            ],
        },
        fecha_creacion: {
            type: Date,
            required: true,
            default: Date.now(),
        },
        fecha_entrega: {
            type: Date,
            required: true,
        },
        urgente: {
            type: Boolean,
            required: true,
        },
        log: [
            {
                usuario_id: {
                    type: mongoose.Types.ObjectId,
                    required: true,
                    ref: "usuarios",
                },
                accion: {
                    type: String,
                    required: true,
                },
                fecha: {
                    type: Date,
                    required: true,
                    default: Date.now(),
                },
            },
        ],
        notificaciones: [
            {
                usuario_id: {
                    type: mongoose.Types.ObjectId,
                    required: true,
                    ref: "usuarios",
                },
                nootificacion: {
                    type: String,
                    required: true,
                },
                fecha: {
                    type: Date,
                    required: true,
                    default: Date.now(),
                },
            },
        ],
        historial_respuestas: [
            {
                usuario_id: {
                    required: true,
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "usuarios",
                },
                contenido: {
                    type: String,
                    required: true,
                },
                files: [],
                fecha_envio: {
                    type: Date,
                    required: true,
                    default: Date.now(),
                },
            },
        ],
    },
    { collection: "proyectos" }
);

module.exports = mongoose.model("proyectos", ProyectoModel);
