const PTO = require("../models/PTOModel");
const mongoose = require("mongoose");
const Usuario = require("../models/usuarioModel");

const crearPTO = async (data) => {
    const nuevoPTO = new PTO(data);
    return await nuevoPTO.save();
};

const obtenerTodosPTO = async () => {
    return await PTO.find().populate("empleado_id", "nombre email");
};

const obtenerPTOPorEmpleado = async (empleado_id) => {
    return await PTO.find({ empleado_id }).populate({ path: "empleado_id", model: Usuario, select: "nombre email" });
};

const actualizarEstadoPTO = async (id, estado) => {
    return await PTO.findByIdAndUpdate(id, { estado }, { new: true });
};

const obtenerEmpleadosConPTO = async () => {
    const empleadosConPTO = await PTO.aggregate([
        {
            $group: {
                _id: "$empleado_id"
            }
        },
        {
            $lookup: {
                from: "usuarios",
                localField: "_id",
                foreignField: "_id",
                as: "empleado"
            }
        },
        {
            $unwind: "$empleado"
        },
        {
            $project: {
                _id: "$empleado._id",
                nombre: "$empleado.nombre",
                email: "$empleado.email",
                tipo_usuario: "$empleado.tipo_usuario"
            }
        }
    ]);

    return empleadosConPTO;
};

module.exports = {
    crearPTO,
    obtenerTodosPTO,
    obtenerPTOPorEmpleado,
    actualizarEstadoPTO,
    obtenerEmpleadosConPTO 
};