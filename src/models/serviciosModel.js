const mongoose = require("mongoose");

const ServiciosModel = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    categoria: {
      type: String,
      required: true,
    },
    paquetes: [
      {
        nombre: {
          type: String,
          required: true,
        },
        descripcion: {
          type: String,
          required: true,
        },
        nivel: {
          type: String,
          required: true,
        },
        duracion: {
          type: String,
          required: true,
        },
        beneficios: {
          type: [String],
          required: true,
        },
        precio: {
          type: Number,
          required: true,
        },
      },
    ],
    fecha_creacion: {
      type: Date,
      default: Date.now(),
      required: true,
    },
    ultima_modificacion: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { collection: "servicios" }
);

module.exports = mongoose.model("servicios", ServiciosModel);
