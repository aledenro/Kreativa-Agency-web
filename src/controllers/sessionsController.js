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

         if(!userId){
                 return res.sendStatus(400)
            }

         try {

            const user = await verificarUsuarioExistente(userId)

            if (!user || lodash.isEmpty(user)){
                return res.sendStatus(404)
            }

            const sessionFound = await SessionsService.findActiveSessionByUserId(user._id)

            return res.json({found: sessionFound})
         } catch (error) {
            console.log(error.message)
            return res.sendStatus(500)
            
         }
    }
}

module.exports = new SessionsController();