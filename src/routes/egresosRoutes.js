const express = require("express");
const egresosController = require("../controllers/egresosController");

const router = express.Router();

router.post("/", egresosController.agregarEgreso);

module.exports = router;