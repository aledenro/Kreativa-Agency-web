const PagosModel = require("../models/pagosModel");

class PagosService {
    async createPago(data) {
        try {
            const pago = new PagosModel(data);

            pago.save();

            return pago;
        } catch (error) {
            throw new Error(`Error creando el pago: ${error.message}`);
        }
    }

    async getAllPagos() {
        try {
            return await PagosModel.find().populate("cliente_id", "nombre");
        } catch (error) {
            throw new Error(`Error al obtener los pagos: ${error.message}`);
        }
    }
}

module.exports = new PagosService();
