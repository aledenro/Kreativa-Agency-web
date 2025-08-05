const xlsx = require("xlsx-js-style");

class printExcelService {
	applyStyles(sheet, data, columns) {
		const headerStyle = {
			fill: { fgColor: { rgb: "ff0072" } },
			font: {
				name: "Century Gothic",
				sz: 10,
				bold: true,
				color: { rgb: "ffffff" },
			},
			alignment: {
				horizontal: "center",
				vertical: "center",
			},
			border: {
				top: { style: "thin", color: { rgb: "110d27" } },
				bottom: { style: "thin", color: { rgb: "110d27" } },
				left: { style: "thin", color: { rgb: "110d27" } },
				right: { style: "thin", color: { rgb: "110d27" } },
			},
		};

		const dataStyle = {
			font: { name: "Century Gothic", sz: 10 },
			alignment: { horizontal: "left", vertical: "center" },
			border: {
				top: { style: "thin", color: { rgb: "8788ab" } },
				bottom: { style: "thin", color: { rgb: "8788ab" } },
				left: { style: "thin", color: { rgb: "8788ab" } },
				right: { style: "thin", color: { rgb: "8788ab" } },
			},
		};

		const alternateRowStyle = {
			...dataStyle,
			fill: { fgColor: { rgb: "ffebf4" } },
		};

		for (let col = 0; col < columns.length; col++) {
			const cellAddress = xlsx.utils.encode_cell({ r: 0, c: col });
			if (sheet[cellAddress]) {
				sheet[cellAddress].s = headerStyle;
			}
		}

		for (let row = 1; row <= data.length; row++) {
			for (let col = 0; col < columns.length; col++) {
				const cellAddress = xlsx.utils.encode_cell({ r: row, c: col });
				if (sheet[cellAddress]) {
					sheet[cellAddress].s = row % 2 === 0 ? alternateRowStyle : dataStyle;
				}
			}
		}

		return sheet;
	}

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
				return { wch: Math.min(maxLength + 2, 50) };
			});

			sheet["!cols"] = colWidths;

			this.applyStyles(sheet, data, columns);

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
				if (!data[i] || data[i].length === 0) {
					continue;
				}

				const sheet = xlsx.utils.json_to_sheet(data[i]);
				xlsx.utils.sheet_add_aoa(sheet, [columns[i]], { origin: "A1" });

				const columnKeys = Object.keys(data[i][0]);
				const colWidths = columnKeys.map((key) => {
					const maxLength = data[i].reduce((max, row) => {
						const value =
							row[key] !== undefined && row[key] !== null
								? row[key].toString()
								: "";
						return Math.max(max, value.length);
					}, key.length);
					return { wch: Math.min(maxLength + 2, 50) };
				});

				sheet["!cols"] = colWidths;

				this.applyStyles(sheet, data[i], columns[i]);

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
