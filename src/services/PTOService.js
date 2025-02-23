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

module.exports = { crearPTO, obtenerTodosPTO, obtenerPTOPorEmpleado, actualizarEstadoPTO };