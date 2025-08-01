const PTOService = require("../services/PTOService");

const crearPTO = async (req, res) => {
    try {
        const pto = await PTOService.crearPTO(req.body);
        res.status(201).json({ message: "PTO creado exitosamente", PTO: pto });
    } catch (error) {
        res.status(500).json({ message: "Error al crear PTO", error });
    }
};

const obtenerTodosPTO = async (req, res) => {
    try {
        const ptoList = await PTOService.obtenerTodosPTO();
        res.status(200).json(ptoList);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las solicitudes de PTO" });
    }
};

const obtenerPTOPorEmpleado = async (req, res) => {
    try {
        const { empleado_id } = req.params;
        const ptoList = await PTOService.obtenerPTOPorEmpleado(empleado_id);

        if (!ptoList || ptoList.length === 0) {
            return res.status(200).json({ message: "Este usuario no tiene solicitudes de PTO." });
        }

        res.status(200).json(ptoList);
    } catch (error) {
        console.error("Error en obtenerPTOPorEmpleado:", error);
        res.status(500).json({ message: "Error al obtener los PTO del empleado", error: error.message });
    }
};

const actualizarEstadoPTO = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        const ptoActualizado = await PTOService.actualizarEstadoPTO(id, estado);
        res.status(200).json({ message: "Estado actualizado correctamente", PTO: ptoActualizado });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el estado del PTO" });
    }
};


const obtenerEmpleadosConPTO = async (req, res) => {
    try {
        const empleados = await PTOService.obtenerEmpleadosConPTO();
        res.status(200).json(empleados);
    } catch (error) {
        console.error("Error en obtenerEmpleadosConPTO:", error);
        res.status(500).json({ message: "Error al obtener empleados con PTO", error: error.message });
    }
};

module.exports = {
    crearPTO,
    obtenerTodosPTO,
    obtenerPTOPorEmpleado,
    actualizarEstadoPTO,
    obtenerEmpleadosConPTO, 
};