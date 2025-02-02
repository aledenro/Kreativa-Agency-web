const EgresosService = require("../services/egresosService");
const lodash = require("lodash");

class EgresosController {
    async agregarEgreso(req, res) {
        try {
            // Validar que están todos los datos
            if (lodash.isEmpty(req.body)) {
                return res.status(400).json({ error: "Para registrar el egreso debe completar todos los campos" });
            }

            // Lógica en el servicio
            const egreso = await EgresosService.agregarEgreso(req.body);
            return res.status(201).json(egreso);
        } catch (error) {
            console.error("Error al intentar registar el egreso: " + error.message);

            if (error.name === "ValidationError") {
                return res.status(400).json({ error: "Datos inválidos", details: error.message });
            }

            // Error para otros casos    
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async obtenerEgresos(req, res) {
        try {
            const egresos = await EgresosService.obtenerEgresos();
            return res.status(200).json(egresos);
        } catch (error) {
            console.error("Error al obtener egresos: " + error.message);
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async editarEgreso(req, res) {
        try {
            const { id } = req.params; // Obtener el ID del egreso a editar
            let nuevosDatos = req.body; // Obtener los nuevos datos

            // Campos permitidos para editar
            const camposPermitidos = ["fecha", "monto", "categoria", "descripcion", "proveedor", "estado", "nota"];

            // Filtrar solo los campos permitidos
            nuevosDatos = Object.keys(nuevosDatos)
                .filter(key => camposPermitidos.includes(key)) // Solo dejar los campos permitidos
                .reduce((obj, key) => {
                    obj[key] = nuevosDatos[key]; // Mantener solo los datos válidos
                    return obj;
                }, {});

            // Lógica en el servicio para editar el egreso
            const egresoActualizado = await EgresosService.editarEgreso(id, nuevosDatos);

            if (!egresoActualizado) {
                return res.status(404).json({ error: "Egreso no encontrado" });
            }

            return res.status(200).json(egresoActualizado);
        } catch (error) {
            console.error("Error al intentar editar el egreso: " + error.message);

            // Si el error es por datos inválidos o faltantes)
            if (error.name === "ValidationError") {
                return res.status(400).json({ error: "Datos inválidos, por favor ingrese los datos correctamente", details: error.message });
            }

            // Error para otros casos
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}

module.exports = new EgresosController();