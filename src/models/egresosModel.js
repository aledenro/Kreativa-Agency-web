const mongoose = require("mongoose");

const EgresosModel = new mongoose.Schema(
    {
        fecha: {
            type: Date,
            required: true,
            default: Date.now,
        },
        monto: {
            type: Number,
            required: true,
            min: 0, // para el monto no pueda ser negativo
        },
        categoria: {
            type: String,
            required: true,
        },
        descripcion: {
            type: String,
            required: true,
        },
        proveedor: {
            type: String,
            required: true,
        },
        estado: {
            type: String,
            required: true,
            enum: ["Aprobado", "Pendiente", "Rechazado"],
        },
        nota: {
            type: String,
            required: true,
        },
        fecha_creacion: {
            type: Date,
            required: true,
            default: Date.now(),
        },
        ultima_modificacion: {
            type: Date,
            required: true,
            default: Date.now(),
        },
    },
    {collection: "egresos"}
);

EgresosModel.pre('save', function(next) {
    this.ultima_modificacion = Date.now();
    next();
    }); // para que la última modificación se actualice automáticamente
  
module.exports = mongoose.model("egresos", EgresosModel);