const ingresosModel = require("../models/ingresosModel");
const IngresosModel = require("../models/ingresosModel");
const Usuario = require("../models/usuarioModel");
const mongoose = require("mongoose");
require("../models/categoriaServicioModel");

const ingresosService = {
    async registrarIngreso({
        cedula,
        fecha,
        monto,
        descripcion,
        estado,
        categoria,
    }) {
        // Validar si el usuario existe en la base de datos
        const usuarioExistente = await Usuario.findOne({ cedula });
        if (!usuarioExistente) {
            throw new Error("El cliente con esta cédula no está registrado.");
        }

        // Opcional: Validar que la categoría exista
        const categoriaExistente = await mongoose.connection.db
            .collection("categorias_servicio")
            .findOne({ _id: new mongoose.Types.ObjectId(categoria) });
        if (!categoriaExistente) {
            throw new Error("La categoría seleccionada no existe.");
        }

        // Crear el nuevo ingreso utilizando la fecha de vencimiento y la categoría seleccionada
        const nuevoIngreso = new IngresosModel({
            cedula,

            fecha, // Fecha de vencimiento proporcionada por el usuario
            nombre_cliente: usuarioExistente.nombre,

            monto,
            descripcion,
            estado,
            //nota,
            categoria, // Se almacena el ID de la categoría seleccionada
        });

        await nuevoIngreso.save();
        return nuevoIngreso;
    },

    // Buscar un usuario por cédula
    async buscarUsuarioPorCedula(cedula) {
        try {
            const usuario = await Usuario.findOne({ cedula });
            if (!usuario) {
                throw new Error("Usuario no encontrado.");
            }
            return usuario;
        } catch (error) {
            throw new Error("Error al buscar el usuario: " + error.message);
        }
    },

    async obtenerIngresos() {
        return await IngresosModel.find({ activo: true }).sort({ fecha: -1 });
    },

    async obtenerIngresoPorId(id) {
        const ingreso = await IngresosModel.findById(id);
        if (!ingreso) {
            throw new Error("Ingreso no encontrado.");
        }
        return ingreso;
    },

    // Función para actualizar un ingreso
    async actualizarIngreso(
        id,
        { cedula, fecha, monto, descripcion, servicio, estado, nota, activo }
    ) {
        // Buscar el ingreso
        const ingreso = await IngresosModel.findById(id);
        if (!ingreso) {
            throw new Error("Ingreso no encontrado.");
        }

        // Actualizar el ingreso con los nuevos valores
        ingreso.cedula = cedula || ingreso.cedula;
        ingreso.fecha = fecha || ingreso.fecha;
        ingreso.monto = monto || ingreso.monto;
        ingreso.descripcion = descripcion || ingreso.descripcion;
        ingreso.servicio = servicio || ingreso.servicio;
        ingreso.estado = estado || ingreso.estado;
        ingreso.nota = nota || ingreso.nota;
        ingreso.activo = activo !== undefined ? activo : ingreso.activo; // No modificar si no se pasa el valor

        // Guardar el ingreso actualizado
        await ingreso.save();
        return ingreso;
    },

    // Desactivar un ingreso
    async desactivarIngresoById(id) {
        try {
            const ingresoDesactivado = await IngresosModel.findByIdAndUpdate(
                id,
                { activo: false, ultima_modificacion: Date.now() },
                { new: true }
            );
            if (!ingresoDesactivado) {
                throw new Error(`Ingreso ${id} no encontrado`);
            }
            return ingresoDesactivado;
        } catch (error) {
            throw new Error(
                `No se pudo desactivar el ingreso ${id}: ` + error.message
            );
        }
    },

    // Activar un ingreso
    async activarIngresoById(id) {
        try {
            const ingresoActivado = await IngresosModel.findByIdAndUpdate(
                id,
                { activo: true, ultima_modificacion: Date.now() },
                { new: true }
            );
            if (!ingresoActivado) {
                throw new Error(`Ingreso ${id} no encontrado`);
            }
            return ingresoActivado;
        } catch (error) {
            throw new Error(
                `No se pudo activar el ingreso ${id}: ` + error.message
            );
        }
    },

    async obtenerIngresosPorMes(mes, año) {
        if (!mes || !año) {
            throw new Error("Debe proporcionar mes y año.");
        }

        try {
            // Calculamos las fechas de inicio y fin del mes
            const inicioDelMes = new Date(año, mes - 1, 1); // El primer día del mes
            const finDelMes = new Date(año, mes, 0); // El último día del mes

            // Ajustamos el finDelMes para que tenga la última hora del día
            finDelMes.setHours(23, 59, 59, 999);

            console.log(`Inicio del mes: ${inicioDelMes}`);
            console.log(`Fin del mes: ${finDelMes}`);

            // Buscamos todos los ingresos activos dentro del rango de fechas
            const ingresosPorMes = await IngresosModel.find({
                activo: true,
                fecha: {
                    $gte: inicioDelMes, // Mayor o igual a la fecha de inicio
                    $lte: finDelMes, // Menor o igual a la fecha de fin
                },
            }).exec();

            if (ingresosPorMes.length === 0) {
                throw new Error(
                    "No se encontraron ingresos para el mes y año proporcionados."
                );
            }

            // Calculamos el total de ingresos y la cantidad
            const totalIngresos = ingresosPorMes.reduce(
                (total, ingreso) => total + ingreso.monto,
                0
            );
            const cantidadIngresos = ingresosPorMes.length;

            // Filtramos los datos para el resumen (nombre_cliente, fecha, monto)
            const detalleIngresos = ingresosPorMes.map((ingreso) => ({
                nombre_cliente: ingreso.nombre_cliente,
                fecha: ingreso.fecha,
                monto: ingreso.monto,
                servicio: ingreso.servicio,
            }));

            // Devolvemos el resumen y el detalle
            return {
                resumen: {
                    totalIngresos,
                    cantidadIngresos,
                },
                detalle: detalleIngresos,
            };
        } catch (error) {
            console.error(
                "Error al obtener los ingresos por mes: " + error.message
            );
            throw new Error("Error al obtener los ingresos por mes");
        }
    },

    async obtenerIngresosPorAnio(anio) {
        try {
            let fechaInicio, fechaFin;

            if (anio) {
                fechaInicio = new Date(anio, 0, 1); // 1 de enero del año dado
                fechaFin = new Date(anio, 11, 31, 23, 59, 59, 999); // 31 de diciembre del año dado
            } else {
                const today = new Date();
                fechaInicio = new Date(today.getFullYear(), 0, 1);
                fechaFin = new Date(
                    today.getFullYear(),
                    11,
                    31,
                    23,
                    59,
                    59,
                    999
                );
            }

            // Filtramos solo los ingresos activos y dentro del rango de fechas
            const ingresos = await IngresosModel.find({
                fecha: { $gte: fechaInicio, $lte: fechaFin },
                activo: true, // Filtrar solo los ingresos activos
            });

            // Sumamos el monto de todos los ingresos filtrados
            const totalIngresos = ingresos.reduce(
                (total, ingreso) => total + ingreso.monto,
                0
            );

            return totalIngresos;
        } catch (error) {
            console.error("Error al obtener los ingresos por año:", error);
            throw new Error("No se pudieron obtener los ingresos por año.");
        }
    },

    async getIngresosDateRange(fechaInicio, fechaFin) {
        try {
            fechaInicio = new Date(fechaInicio);
            fechaFin = new Date(fechaFin);
            fechaFin.setHours(23, 59, 59, 999);

            const ingresos = await ingresosModel
                .find({
                    $and: [
                        { fecha: { $gte: fechaInicio } },
                        { fecha: { $lte: fechaFin } },
                    ],
                })
                .populate("categoria", "nombre")
                .select({
                    fecha: 1,
                    monto: 1,
                    descripcion: 1,
                    nombre_cliente: 1,
                    categoria: 1,
                    estado: 1,
                    _id: 0,
                });

            const ingresosFormated =
                ingresos.length > 0
                    ? ingresos.map((ingreso) => {
                          return {
                              fecha: new Date(
                                  ingreso.fecha
                              ).toLocaleDateString(),
                              monto: ingreso.monto,
                              descripcion: ingreso.descripcion,
                              nombre_cliente: ingreso.nombre_cliente,
                              categoria: ingreso.categoria.nombre,
                              estado: ingreso.estado,
                          };
                      })
                    : [];

            return ingresosFormated;
        } catch (error) {
            console.log(
                `Error al obtener los ingreso entre las fechas ${fechaInicio}  y ${fechaFin}: ${error.message}`
            );

            throw new Error(
                `Error al obtener los ingreso entre las fechas ${fechaInicio}  y ${fechaFin}`
            );
        }
    },
};

module.exports = ingresosService;
