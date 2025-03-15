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
}

module.exports = new PagosController();
