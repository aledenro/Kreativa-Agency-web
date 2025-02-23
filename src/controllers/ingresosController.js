const ingresosService = require("../services/ingresosService");

const ingresosController = {
    async registrarIngreso(req, res) {
        try {
            const nuevoIngreso = await ingresosService.registrarIngreso(req.body);
            res.status(201).json({
                message: "Ingreso registrado con éxito.",
                ingreso: nuevoIngreso,
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async obtenerIngresos(req, res) {
        try {
            const ingresos = await ingresosService.obtenerIngresos();
            res.status(200).json(ingresos);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener ingresos." });
        }
    },

    async obtenerIngresoPorId(req, res) {
        try {
            const ingreso = await ingresosService.obtenerIngresoPorId(req.params.id);
            res.status(200).json(ingreso);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    },

    async actualizarIngreso(req, res) {
        try {
            const ingresoActualizado = await ingresosService.actualizarIngreso(req.params.id, req.body);
            res.status(200).json({
                message: "Ingreso actualizado con éxito.",
                ingreso: ingresoActualizado,
            });
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    },

    // Función para activar un ingreso
    async activarIngreso(req, res) {
        try {
            const { id } = req.params;
            const ingreso = await ingresosService.activarIngresoById(id);
            return res.status(200).json({ mensaje: "Ingreso activado", ingreso });
        } catch (error) {
            console.error("Error al activar el ingreso: " + error.message);
            return res.status(500).json({ error: error.message });
        }
    },

    // Función para desactivar un ingreso
    async desactivarIngreso(req, res) {
        try {
            const { id } = req.params;
            const ingreso = await ingresosService.desactivarIngresoById(id);
            return res.status(200).json({ mensaje: "Ingreso desactivado", ingreso });
        } catch (error) {
            console.error("Error al desactivar el ingreso: " + error.message);
            return res.status(500).json({ error: error.message });
        }
    }

};

module.exports = ingresosController;