const PagosService = require("../services/pagosService");
const lodash = require("lodash");

class PagosController {
    async createPago(req, res) {
        try {
            const data = req.body;
            const pago = await PagosService.createPago(data);

            return res.status(201).json({ pago: pago });
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({ error: error.message });
        }
    }

    async getAllPagos(req, res) {
        try {
            const pagos = await PagosService.getAllPagos();

            if (!pagos && !lodash.isEmpty(pagos)) {
                return res.status(404).json(pagos);
            }

            return res.json(pagos);
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({ error: error.message });
        }
    }

    async getByCliente(req, res) {
        try {
            const id = req.params.id;

            const pagos = await PagosService.getByCliente(id);

            if (!pagos && !lodash.isEmpty(pagos)) {
                return res.status(404).json(pagos);
            }

            return res.json(pagos);
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const id = req.params.id;

            const pago = await PagosService.getById(id);

            if (!pago && !lodash.isEmpty(pago)) {
                return res.status(404).json(pago);
            }

            return res.json(pago);
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({ error: error.message });
        }
    }

    async updateById(req, res) {
        try {
            const id = req.params.id;
            const data = req.body;

            const pago = await PagosService.updateById(id, data);

            if (!pago && !lodash.isEmpty(pago)) {
                return res.status(404).json(pago);
            }

            return res.json(pago);
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new PagosController();
