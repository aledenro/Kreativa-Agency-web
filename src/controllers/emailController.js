const { sendEmail } = require("../services/emailService");

class EmailController {
    async send(req, res) {
        try {
            const idReceptor = req.body.idReceptor;
            const subject = req.body.subject;
            const emailContent = req.body.emailContent;

            if (!idReceptor || !subject || !emailContent) {
                return res.sendStatus(400);
            }

            await sendEmail(idReceptor, emailContent, subject);

            return res.sendStatus(200);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new EmailController();
