process.env.NODE_PATH = "/opt/nodejs/node_modules";
require("module").Module._initPaths();
require("dotenv").config();
const connectDB = require("./config/dbConnection");
const sendEmail = require("./service/emailService");

module.exports.handler = async (event) => {
    try {
        const db = await connectDB();
        console.log("dbConn");

        const pagosConUsuarios = await db
            .collection("pagos")
            .aggregate([
                {
                    $match: { estado: "Pendiente" },
                },
                {
                    $lookup: {
                        from: "usuarios",
                        localField: "cliente_id",
                        foreignField: "_id",
                        as: "usuario",
                    },
                },
                {
                    $unwind: "$usuario",
                },
                {
                    $project: {
                        _id: 1,
                        titulo: 1,
                        detalle: 1,
                        fecha_vencimiento: 1,
                        monto: 1,
                        "usuario.email": 1,
                    },
                },
            ])
            .toArray();

        console.log("array  obtenido");

        for (const pago of pagosConUsuarios) {
            await sendEmail(pago);
        }
    } catch (error) {
        console.error("Error", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error en lambda" }),
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Lambda ejecutada bien" }),
    };
};
