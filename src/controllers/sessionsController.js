const SessionsService = require("../services/sessionsService")

class SessionsController {
    async addSession(req, res){
        try {
            const data = req.body

            const session = await SessionsService.addSession(data)

            return res.sendStatus(201)
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