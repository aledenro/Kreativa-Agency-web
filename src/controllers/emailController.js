const { sendEmail, sendEmailExterno } = require("../services/emailService");

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

	async sendExterno(req, res) {
		try {
			const recipientEmail = req.body.recipientEmail;
			const subject = req.body.subject;
			const emailContent = req.body.emailContent;

			if (!recipientEmail || !subject || !emailContent) {
				return res.sendStatus(400);
			}

			await sendEmailExterno(recipientEmail, emailContent, subject);

			return res.sendStatus(200);
		} catch (error) {
			return res.status(500).json({ error: error.message });
		}
	}
}

module.exports = new EmailController();
