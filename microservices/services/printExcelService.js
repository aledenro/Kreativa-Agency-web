const xlsx = require("xlsx");

class printExcelService {
    async onePageExcel(columns, data, sheetName) {
        try {
            const sheet = xlsx.utils.json_to_sheet(data);
            xlsx.utils.sheet_add_aoa(sheet, [columns], { origin: "A1" });
            const columnKeys = Object.keys(data[0]);
            const colWidths = columnKeys.map((key) => {
                const maxLength = data.reduce((max, row) => {
                    const value =
                        row[key] !== undefined && row[key] !== null
                            ? row[key].toString()
                            : "";
                    return Math.max(max, value.length);
                }, key.length);
                return { wch: maxLength };
            });

            sheet["!cols"] = colWidths;

            const book = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(book, sheet, sheetName);

            const fileBuffer = xlsx.write(book, {
                bookType: "xlsx",
                type: "buffer",
            });

            return fileBuffer;
        } catch (error) {
            console.error(
                `Error al generar el file de una sola hoja: ${error.message}`
            );
            throw new Error("Error al generar el file de una sola hoja");
        }
    }

    async multiPageExcel(columns, data, sheetName, pageCount) {
        try {
            const book = xlsx.utils.book_new();

            for (let i = 0; i < pageCount; i++) {
                const sheet = xlsx.utils.json_to_sheet(data[i]);
                xlsx.utils.sheet_add_aoa(sheet, [columns[i]], { origin: "A1" });

                const columnKeys = Object.keys(data[i][0]);
                const colWidths = columnKeys.map((key) => {
                    const maxLength = data.reduce((max, row) => {
                        const value =
                            row[key] !== undefined && row[key] !== null
                                ? row[key].toString()
                                : "";
                        return Math.max(max, value.length);
                    }, key.length);
                    return { wch: maxLength };
                });

                sheet["!cols"] = colWidths;

                xlsx.utils.book_append_sheet(book, sheet, sheetName[i]);
            }

            const fileBuffer = xlsx.write(book, {
                bookType: "xlsx",
                type: "buffer",
            });

            return fileBuffer;
        } catch (error) {
            console.error(
                `Error al generar el file de varias hojas: ${error.message}`
            );
            throw new Error("Error al generar el file de varias hojas");
        }
    }
}

module.exports = new printExcelService();
