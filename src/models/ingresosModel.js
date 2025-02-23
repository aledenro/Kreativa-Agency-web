const mongoose = require("mongoose");
const Usuario = require("../models/usuarioModel");

const IngresosModel = new mongoose.Schema(
    {
        fecha: {
            type: Date,
            required: true,
            default: Date.now,
        },
        monto: {
            type: Number,
            required: true,
            min: 0, // Para evitar valores negativos
        },
        descripcion: {
            type: String,
            required: true,
        },
        cedula: {
            type: String,
            required: true,
            validate: {
                validator: async function (cedula) {
                    console.log('Buscando cliente con cédula:', cedula); // Aquí agregamos un log
                    const usuario = await Usuario.findOne({ cedula });
                    console.log('Cliente encontrado:', usuario); // Aquí agregamos otro log
                    return !!usuario; // Devuelve true si existe, false si no
                },
                message: "La cédula ingresada no pertenece a un usuario registrado.",
            },
        },        
        servicio: {
            type: String,
            required: true,
        },
        estado: {
            type: String,
            required: true,
            enum: ["Pendiente de pago", "Aprobado"],
        },
        nota: {
            type: String,
        },
        fecha_creacion: {
            type: Date,
            required: true,
            default: Date.now,
        },
        ultima_modificacion: {
            type: Date,
            required: true,
            default: Date.now,
        },
        activo: { 
            type: Boolean,
            default: true,
            required: true
        },
    },
    { collection: "ingresos" }
);

IngresosModel.pre("save", function (next) {
    this.ultima_modificacion = Date.now();
    next();
}); // Actualiza la última modificación automáticamente

module.exports = mongoose.model("ingresos", IngresosModel);