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

    async getByCliente(id) {
        try {
            return await PagosModel.find({ cliente_id: id });
        } catch (error) {
            throw new Error(`Error al obtener los pagos: ${error.message}`);
        }
    }

    async getById(id) {
        try {
            return await PagosModel.findById(id);
        } catch (error) {
            throw new Error(
                `Error al obtener el pago con el id ${id}: ${error.message}`
            );
        }
    }

    async updateById(id, data) {
        try {
            return await PagosModel.findByIdAndUpdate(id, data, {
                new: true,
            });
        } catch (error) {
            throw new Error(
                `Error al actualizar el pago con el id ${id}: ${error.message}`
            );
        }
    }
}

module.exports = new PagosService();
