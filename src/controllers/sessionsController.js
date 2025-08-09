const SessionsService = require("../services/sessionsService")
const lodash = require("lodash")
const {verificarUsuarioExistente} = require("../services/usuarioService")

class SessionsController {
    async addSession(req, res){
        try {
            const data = req.body

            if(!data || lodash.isEmpty(data) || !data.username || !data.token){
                 return res.sendStatus(400)
            }

            const user = await verificarUsuarioExistente(data.username)

            console.log(data.username)
            console.log(user)

            if (!user || lodash.isEmpty(user)){
                return res.sendStatus(404)
            }

            const sessionData = {
                user: user._id,
                estado: true,
                token: data.token,
                fecha: Date.now(),
                motivoFinalizacion: ""
            }

            const session = await SessionsService.addSession(sessionData)

            if(session && !lodash.isEmpty(session)){
                return res.sendStatus(201)
            }
        } catch (error) {
            return res.sendStatus(500)
        }
    }

    async updateSessionStatus(req, res){
        const userId = req.body;

        try {
            const sessionRes = await SessionsService.updateSessionStatus(userId)

            if(sessionRes.error){
                return res.status(404).json(sessionRes.error)
            }

            return res.status(200).json(sessionRes.message)
        } catch (error) {
            return res.sendStatus(500)
        }   
    }

    async getSessionByUserId(req, res){
         const userId = req.params.id;

         try {
            const sessionFound = await SessionsService.findActiveSessionByUserId(userId)

            return res.json({found: sessionFound})
         } catch (error) {
            return res.sendStatus(500)
         }
    }
}

module.exports = new SessionsController();