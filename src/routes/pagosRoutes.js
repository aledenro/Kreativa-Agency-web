const express = require("express");
const router = express.Router();
const {verificarToken, verificarTokenValidoSesion} = require("../middleware/authMiddleware");

const PagosController = require("../controllers/pagosController");

router.post("/", verificarToken, verificarTokenValidoSesion, PagosController.createPago);
router.get("/", verificarToken, verificarTokenValidoSesion, PagosController.getAllPagos);
router.get("/cliente/:id", verificarToken, verificarTokenValidoSesion, PagosController.getByCliente);
router.get("/id/:id", verificarToken, verificarTokenValidoSesion, PagosController.getById);
router.put("/update/:id", verificarToken, verificarTokenValidoSesion, PagosController.updateById);

module.exports = router;
