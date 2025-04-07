const printExcelService = require("../services/printExcelService");

class printExcelController {
    async onePageExcel(req, res) {
        try {
            const cols = req.body.cols;
            const data = req.body.data;
            const fileName = req.body.fileName;
            const sheetName = req.body.sheetName;

            if (!cols || !data || !fileName || !sheetName) {
                return res.status(400).json({
                    error: "El request no posee los datos necesarios.",
                });
            }

            const excelBuffer = await printExcelService.onePageExcel(
                cols,
                data,
                sheetName
            );

            res.set({
                "Content-Type":
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": `attachment; filename="${fileName}.xlsx"`,
            });

            return res.send(excelBuffer);
        } catch (error) {
            return res
                .status(500)
                .json({ error: "Error al generar el archivo." });
        }
    }

    async multiPageExcel(req, res) {
        try {
            const cols = req.body.cols;
            const data = req.body.data;
            const fileName = req.body.fileName;
            const sheetName = req.body.sheetName;
            const pageCount = req.body.pageCount;

            if (!cols || !data || !fileName || !sheetName) {
                return res.status(400).json({
                    error: "El request no posee los datos necesarios.",
                });
            }

            const excelBuffer = await printExcelService.multiPageExcel(
                cols,
                data,
                sheetName,
                pageCount
            );

            res.set({
                "Content-Type":
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": `attachment; filename="${fileName}.xlsx"`,
            });

            return res.send(excelBuffer);
        } catch (error) {
            return res
                .status(500)
                .json({ error: "Error al generar el archivo." });
        }
    }
}

module.exports = new printExcelController();
