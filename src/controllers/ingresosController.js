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

    async activarDesactivarIngreso(req, res) {
        try {
            const { activo } = req.body;
            if (typeof activo !== "boolean") {
                return res.status(400).json({ message: "El valor de 'activo' debe ser true o false." });
            }
    
            const ingresoModificado = await ingresosService.activarDesactivarIngreso(req.params.id, activo);
            res.status(200).json({
                message: `Ingreso ${activo ? "activado" : "desactivado"} con éxito.`,
                ingreso: ingresoModificado,
            });
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    },    
};

module.exports = ingresosController;