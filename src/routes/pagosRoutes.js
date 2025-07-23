const express = require("express");
const router = express.Router();
const verificarToken = require("../middleware/authMiddleware");

const PagosController = require("../controllers/pagosController");

router.post("/", verificarToken, PagosController.createPago);
router.get("/", verificarToken, PagosController.getAllPagos);
router.get("/cliente/:id", verificarToken, PagosController.getByCliente);
router.get("/id/:id", verificarToken, PagosController.getById);
router.put("/update/:id", verificarToken, PagosController.updateById);

module.exports = router;
