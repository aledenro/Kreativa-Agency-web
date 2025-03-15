const express = require("express");
const router = express.Router();

const PagosController = require("../controllers/pagosController");

router.post("/", PagosController.createPago);

module.exports = router;
