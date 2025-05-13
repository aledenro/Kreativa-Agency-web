const Movimiento = require("../models/movimientoModel");

const registrarMovimiento = async ({
    tipo,
    idRegistro,
    accion,
    descripcion,
    datosAnteriores,
    datosNuevos,
    usuario,
}) => {
    try {
        const movimiento = new Movimiento({
            tipo,
            idRegistro,
            accion,
            descripcion,
            datosAnteriores,
            datosNuevos,
            usuario,
        });
        await movimiento.save();
        return movimiento;
    } catch (error) {
        console.error("Error al registrar movimiento:", error.message);
        // Puedes lanzar el error para que se maneje en el controlador si lo deseas
        throw error;
    }
};

module.exports = { registrarMovimiento };
