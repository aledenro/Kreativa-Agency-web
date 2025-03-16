const express = require("express");
const router = express.Router();

const PagosController = require("../controllers/pagosController");

router.post("/", PagosController.createPago);
router.get("/", PagosController.getAllPagos);
router.get("/cliente/:id", PagosController.getByCliente);
router.get("/id/:id", PagosController.getById);
router.put("/update/:id", PagosController.updateById);

module.exports = router;
