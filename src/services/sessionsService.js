const SessionsModel = require("../models/sessionsModel")
const lodash = require("lodash")

class SessionsService{
    async addSession(data){
        try {
            const session = new SessionsModel(data)

            await session.save()

            return session;
        } catch (error) {
            throw new Error(`Error al agregar la sesion:  ${error.message}`)
        }
    }

    async updateSessionStatus(userId){
        try {
            const session = await SessionsModel.find({user: userId, estado: true})

            if(!session || lodash.isEmpty(session)){
                return {error: "No se encontró una sesión activa"}
            }

            session.estado = false

            session.save

            return {message: "Estado actualizado de manera correcta."}
        } catch (error) {
            throw new Error("Error al actualizar el estado de la sesión.")
        }
    }

    async findActiveSessionByUserId(userId){
        try {
            const session = await SessionsModel.find({user: userId, estado: true})

            if(!session || lodash.isEmpty(session)){
                return false
            }else{
                return true
            }

        } catch (error) {
            throw new Error("Error al buscar la sesión.")
        }
    }
}

module.exports = new SessionsService()