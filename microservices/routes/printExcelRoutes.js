const express = require("express");
const printExcelController = require("../controllers/printExcelController");

const router = express.Router();

router.post("/singlePage", printExcelController.onePageExcel);
router.post("/multiPage", printExcelController.multiPageExcel);

module.exports = router;
