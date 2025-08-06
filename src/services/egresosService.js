const egresosModel = require("../models/egresosModel");
const EgresosModel = require("../models/egresosModel");

class EgresosService {
    //Agregar egreso
    async agregarEgreso(datosEgreso) {
        try {
            const egreso = new EgresosModel(datosEgreso);
            await egreso.save();
            return egreso;
        } catch (error) {
            throw error;
        }
    }

    //Todos los egresos activos
    async obtenerEgresos() {
        try {
            return await EgresosModel.find({ activo: true });
        } catch (error) {
            throw error;
        }
    }

    // Obtener un egreso por ID
    async obtenerEgresoPorId(id) {
        try {
            const egreso = await EgresosModel.findById(id);
            return egreso;
        } catch (error) {
            throw new Error(
                "Error al obtener el egreso por ID: " + error.message
            );
        }
    }

    // Editar egreso
    async editarEgreso(id, datos) {
        try {
            datos.ultima_modificacion = new Date();
            return await EgresosModel.findByIdAndUpdate(id, datos, {
                new: true,
            });
        } catch (error) {
            throw new Error("Error al editar el egreso: " + error.message);
        }
    }

    // Desactivar un egreso
    async desactivarEgresoById(id) {
        try {
            const egresoDesactivado = await EgresosModel.findByIdAndUpdate(
                id,
                { activo: false, ultima_modificacion: Date.now() },
                { new: true }
            );
            if (!egresoDesactivado) {
                throw new Error(`Egreso ${id} no encontrado`);
            }
            return egresoDesactivado;
        } catch (error) {
            throw new Error(
                `No se pudo desactivar el egreso ${id}: ` + error.message
            );
        }
    }

    // Activar un egreso
    async activarEgresoById(id) {
        try {
            const egresoActivado = await EgresosModel.findByIdAndUpdate(
                id,
                { activo: true, ultima_modificacion: new Date() },
                { new: true }
            );
            if (!egresoActivado) {
                throw new Error(`Egreso ${id} no encontrado`);
            }
            return egresoActivado;
        } catch (error) {
            throw new Error(
                `No se pudo activar el egreso ${id}: ` + error.message
            );
        }
    }

    async obtenerEgresosPorFecha(inicioDelMes, finDelMes) {
        try {
            return await EgresosModel.find({
                fecha: {
                    $gte: inicioDelMes,
                    $lte: finDelMes,
                },
            });
        } catch (error) {
            console.error(
                "Error al obtener los egresos por fecha: " + error.message
            );
            throw new Error("Error al obtener los egresos por fecha");
        }
    }

    async obtenerEgresosPorAnio(anio) {
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
            const egresos = await EgresosModel.find({
                fecha: { $gte: fechaInicio, $lte: fechaFin },
                activo: true,
                estado: "Aprobado",
            });
            const totalEgresos = egresos.reduce(
                (total, egreso) => total + egreso.monto,
                0
            );

            return totalEgresos;
        } catch (error) {
            console.error("Error al obtener los egresos por anio:", error);
            throw new Error("No se pudieron obtener los egresos por anio.");
        }
    }

    async obtenerEgresosPorAnioDetalle(anio) {
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
            const egresos = await EgresosModel.find({
                fecha: { $gte: fechaInicio, $lte: fechaFin },
                activo: true,
                estado: "Aprobado",
            });
            if (egresos.length === 0) {
                return {
                    resumen: { totalEgresos: 0, cantidadEgresos: 0 },
                    detalle: [],
                };
            }
            const totalEgresos = egresos.reduce(
                (sum, egreso) => sum + egreso.monto,
                0
            );
            const cantidadEgresos = egresos.length;
            const detalleEgresos = egresos.map((egreso) => ({
                fecha: egreso.fecha,
                categoria: egreso.categoria,
                proveedor: egreso.proveedor,
                monto: egreso.monto,
            }));
            return {
                resumen: { totalEgresos, cantidadEgresos },
                detalle: detalleEgresos,
            };
        } catch (error) {
            console.error(
                "Error al obtener los egresos por anio:",
                error.message
            );
            throw new Error("No se pudieron obtener los egresos por anio.");
        }
    }

    async getEgresosDateRange(fechaInicio, fechaFin) {
        try {
            fechaInicio = new Date(fechaInicio);
            fechaFin = new Date(fechaFin);
            fechaFin.setHours(23, 59, 59, 999);

            const egresos = await egresosModel
                .find({
                    $and: [
                        { fecha: { $gte: fechaInicio } },
                        { fecha: { $lte: fechaFin } },
                    ],
                })
                .select({
                    fecha: 1,
                    monto: 1,
                    categoria: 1,
                    descripcion: 1,
                    proveedor: 1,
                    estado: 1,
                    _id: 0,
                });

            const egresosFormated =
                egresos.length > 0
                    ? egresos.map((egreso) => {
                        return {
                            fecha: new Date(
                                egreso.fecha
                            ).toLocaleDateString(),
                            monto: egreso.monto,
                            categoria: egreso.categoria,
                            descripcion: egreso.descripcion,
                            proveedor: egreso.proveedor,
                            estado: egreso.estado,
                        };
                    })
                    : [];

            return egresosFormated;
        } catch (error) {
            console.log(
                `Error al obtener los egresos entre las fechas ${fechaInicio}  y ${fechaFin}: ${error.message}`
            );

            throw new Error(
                `Error al obtener los egresos entre las fechas ${fechaInicio}  y ${fechaFin}`
            );
        }
    }
}

module.exports = new EgresosService();
