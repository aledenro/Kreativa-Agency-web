const EgresosModel = require("../models/egresosModel");

class EgresosService {
    async agregarEgreso(datosEgreso) {
        try {
            // Crear un nuevo egreso
            const egreso = new EgresosModel(datosEgreso);
            await egreso.save();
            return egreso;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new EgresosService();