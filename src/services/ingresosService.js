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
        if (usuarioExistente.estado !== "Activo") {
            throw new Error(
                "Solo se pueden registrar ingresos para usuarios activos."
            );
        }

        // Validar que la categoría exista
        const categoriaExistente = await mongoose.connection.db
            .collection("categorias_servicio")
            .findOne({ _id: new mongoose.Types.ObjectId(categoria) });
        if (!categoriaExistente) {
            throw new Error("La categoría seleccionada no existe.");
        }

        // Crear el nuevo ingreso
        const nuevoIngreso = new IngresosModel({
            cedula,

            fecha,
            nombre_cliente: usuarioExistente.nombre,
            email: usuarioExistente.email,
            monto,
            descripcion,
            estado,
            categoria,
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

    async obtenerIngresos(filtro = {}) {
        return await IngresosModel.find(filtro).sort({ fecha: -1 });
    },

    async obtenerIngresoPorId(id) {
        const ingreso = await IngresosModel.findById(id);
        if (!ingreso) {
            throw new Error("Ingreso no encontrado.");
        }
        return ingreso;
    },

    // Actualizar un ingreso
    async actualizarIngreso(
        id,
        { cedula, fecha, monto, descripcion, servicio, estado, nota, activo }
    ) {
        const ingreso = await IngresosModel.findById(id);
        if (!ingreso) {
            throw new Error("Ingreso no encontrado.");
        }
        ingreso.cedula = cedula || ingreso.cedula;
        ingreso.fecha = fecha || ingreso.fecha;
        ingreso.monto = monto || ingreso.monto;
        ingreso.descripcion = descripcion || ingreso.descripcion;
        ingreso.servicio = servicio || ingreso.servicio;
        ingreso.estado = estado || ingreso.estado;
        ingreso.nota = nota || ingreso.nota;
        ingreso.activo = activo !== undefined ? activo : ingreso.activo;
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

    async obtenerIngresosPorMes(mes, anio) {
        if (!mes || !anio) {
            throw new Error("Debe proporcionar mes y año.");
        }

        try {
            const nAnio = parseInt(anio);
            const nMes = parseInt(mes);

            if (isNaN(nAnio)) throw new Error("Año inválido");
            if (isNaN(nMes)) throw new Error("Mes inválido");

            const inicioDelMes = new Date(Date.UTC(nAnio, nMes - 1, 1));
            const finDelMes = new Date(
                Date.UTC(nAnio, nMes, 0, 23, 59, 59, 999)
            );

            // Obtener solo clientes
            const clientes = await Usuario.find({ tipo_usuario: "Cliente" })
                .select("cedula -_id")
                .lean();
            const listaCedulas = clientes.map((c) => c.cedula);

            const ingresos = await IngresosModel.find({
                activo: true,
                estado: "Pagado",
                cedula: { $in: listaCedulas },
                fecha: {
                    $gte: inicioDelMes,
                    $lte: finDelMes,
                },
            })
                .populate("categoria", "nombre")
                .lean();

            if (ingresos.length === 0) {
                return {
                    totalIngresos: 0,
                    cantidadIngresos: 0,
                    detalle: [],
                    datosGrafico: [],
                };
            }

            const totalIngresos = ingresos.reduce((sum, i) => sum + i.monto, 0);
            const cantidadIngresos = ingresos.length;

            const detalle = ingresos.map((ingreso) => ({
                fecha: ingreso.fecha,
                monto: ingreso.monto,
                categoria: ingreso.categoria._id,
                categoriaNombre: ingreso.categoria.nombre,
                nombre_cliente: ingreso.nombre_cliente,
            }));

            const datosGrafico = detalle.reduce((acc, ingreso) => {
                const existente = acc.find(
                    (i) => i.name === ingreso.categoriaNombre
                );
                if (existente) {
                    existente.value += ingreso.monto;
                } else {
                    acc.push({
                        name: ingreso.categoriaNombre,
                        value: ingreso.monto,
                    });
                }
                return acc;
            }, []);

            return {
                totalIngresos,
                cantidadIngresos,
                detalle,
                datosGrafico,
            };
        } catch (error) {
            throw error;
        }
    },

    _agruparPorCategoria(detalle) {
        return detalle.reduce((acc, ingreso) => {
            const existente = acc.find(
                (item) => item.name === ingreso.categoriaNombre
            );
            if (existente) {
                existente.value += ingreso.monto;
            } else {
                acc.push({
                    name: ingreso.categoriaNombre,
                    value: ingreso.monto,
                });
            }
            return acc;
        }, []);
    },

    async obtenerIngresosPorAnio(anio) {
        try {
            let fechaInicio, fechaFin;
            if (anio) {
                fechaInicio = new Date(anio, 0, 1);
                fechaFin = new Date(anio, 11, 31, 23, 59, 59, 999);
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

            const clientes = await Usuario.find({ tipo_usuario: "Cliente" })
                .select("cedula -_id")
                .exec();
            const listaCedulas = clientes.map((c) => c.cedula);
            const ingresos = await IngresosModel.find({
                fecha: { $gte: fechaInicio, $lte: fechaFin },
                activo: true,
                estado: "Pagado",
                cedula: { $in: listaCedulas },
            });

            const totalIngresos = ingresos.reduce(
                (total, ingreso) => total + ingreso.monto,
                0
            );
            return totalIngresos;
        } catch (error) {
            throw new Error("No se pudieron obtener los ingresos por anio.");
        }
    },

    async obtenerIngresosPorAnioDetalle(anio) {
        try {
            let fechaInicio, fechaFin;
            if (anio) {
                fechaInicio = new Date(anio, 0, 1);
                fechaFin = new Date(anio, 11, 31, 23, 59, 59, 999);
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

            const clientes = await require("../models/usuarioModel")
                .find({ tipo_usuario: "Cliente" })
                .select("cedula -_id")
                .exec();
            const listaCedulas = clientes.map((c) => c.cedula);

            const ingresos = await IngresosModel.find({
                fecha: { $gte: fechaInicio, $lte: fechaFin },
                activo: true,
                estado: "Pagado",
                cedula: { $in: listaCedulas },
            });

            const totalIngresos = ingresos.reduce(
                (total, ingreso) => total + ingreso.monto,
                0
            );
            const cantidadIngresos = ingresos.length;
            const detalleIngresos = ingresos.map((ingreso) => ({
                nombre_cliente: ingreso.nombre_cliente,
                fecha: ingreso.fecha,
                monto: ingreso.monto,
                categoria: ingreso.categoria,
                nombre_cliente: ingreso.nombre_cliente,
            }));

            return {
                resumen: { totalIngresos, cantidadIngresos },
                detalle: detalleIngresos,
            };
        } catch (error) {
            throw new Error("No se pudieron obtener los ingresos por anio.");
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
                              categoria: ingreso.categoria?.nombre || "",
                              estado: ingreso.estado,
                          };
                      })
                    : [];

            return ingresosFormated;
        } catch (error) {
            console.log(error.message);
            throw new Error(
                `Error al obtener los ingreso entre las fechas ${fechaInicio}  y ${fechaFin}`
            );
        }
    },
};

module.exports = ingresosService;
