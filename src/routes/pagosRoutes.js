const express = require("express");
const router = express.Router();

const PagosController = require("../controllers/pagosController");

router.post("/", PagosController.createPago);
router.get("/", PagosController.getAllPagos);
router.get("/cliente/:id", PagosController.getByCliente);

module.exports = router;
