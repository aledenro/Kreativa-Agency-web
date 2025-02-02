const EgresosService = require("../services/egresosService");
const lodash = require("lodash");

class EgresosController {
    async agregarEgreso(req, res) {
        try {
            // Validar que están todos los datos
            if (lodash.isEmpty(req.body)) {
                return res.status(400).json({ error: "Para agregar el egreso debe completar todos los campos" });
            }

            // Lógica en el servicio
            const egreso = await EgresosService.agregarEgreso(req.body);
            return res.status(201).json(egreso);
        } catch (error) {
            console.error("Error al intentar agregar el egreso: " + error.message);
            
            if (error.name === "ValidationError") {
                return res.status(400).json({ error: "Datos inválidos", details: error.message });
                }

            // Error para otros casos    
            return res.status(500).json({ error: "Error interno del servidor"});
        }
    }
}

module.exports = new EgresosController();