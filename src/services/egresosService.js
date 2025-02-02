const EgresosModel = require("../models/egresosModel");

class EgresosService {
    async agregarEgreso(datosEgreso) {
        try {
            const egreso = new EgresosModel(datosEgreso);
            await egreso.save();
            return egreso;
        } catch (error) {
            throw error;
        }
    }

    async obtenerEgresos() {
        try {
            return await EgresosModel.find(); // Devuelve todos los egresos de la base de datos
        } catch (error) {
            throw error;
        }
    }

    async editarEgreso(id, datos) {
        return await EgresosModel.findByIdAndUpdate(id, datos, { new: true });
    }
}

module.exports = new EgresosService();