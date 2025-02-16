const mongoose = require("mongoose");

const TareasModel = new mongoose.Schema(
    {
        proyecto_id: {
            type: mongoose.Types.ObjectId,
            ref: "proyectos",
            required: true,
        },
        nombre: { type: String, required: true },
        descripcion: { type: String, required: true },
        colaborador_id: {
            type: mongoose.Types.ObjectId,
            ref: "usuarios",
            required: true,
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
            default: "Por Hacer",
        },
        prioridad: {
            type: String,
            required: true,
            enum: ["Baja", "Media", "Alta"],
        },
        fecha_asignacion: {
            type: Date,
            required: true,
            default: Date.now(),
        },
        fecha_vencimiento: {
            type: Date,
            required: true,
        },
        fecha_creacion: {
            type: Date,
            required: true,
            default: Date.now(),
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
        comentarios: [
            {
                usuario_id: {
                    type: mongoose.Types.ObjectId,
                    required: true,
                    ref: "usuarios",
                },
                contenido: {
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
    },
    { collection: "tareas" }
);

module.exports = new mongoose.model("tareas", TareasModel);
