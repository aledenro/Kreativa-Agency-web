const nodemailer = require("nodemailer");
require("dotenv").config();
const lodash = require("lodash");
const { getEmailUsuario } = require("./usuarioService");

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
	tls: {
		rejectUnauthorized: false,
	},
});

const kreativaEmailTemplate = (title, message, buttonLink, buttonText) => `
<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f7fb;">
  <div style="max-width: 600px; margin: auto; background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 3px 10px rgba(0,0,0,0.1);">
    <p style="font-size: 16px; color: #333;">${message}</p>
    ${buttonLink ? `<a href="${buttonLink}" style="display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: #ff4081; color: #ffffff; text-decoration: none; border-radius: 5px;">${buttonText}</a>` : ""}
  </div>
</div>`;

const enviarCorreoRecuperacion = async (email, token) => {
	try {
		const mailOptions = {
			from: `"Kreativa Agency" <${process.env.EMAIL_USER}>`,
			to: email,
			subject: "🔑 Recupera tu contraseña | Kreativa Agency",
			html: kreativaEmailTemplate(
				"Recupera tu contraseña",
				"Para restablecer tu contraseña haz clic en el botón a continuación:",
				`http://localhost:5173/restablecer/${token}`,
				"Restablecer contraseña"
			),
		};

		await transporter.sendMail(mailOptions);
		console.log("Correo de recuperación enviado a:", email);
	} catch (error) {
		console.error("Error al enviar correo de recuperación:", error);
		throw new Error("No se pudo enviar el correo.");
	}
};

const sendEmail = async (idReceptor, emailContent, subject) => {
	try {
		const user = await getEmailUsuario(idReceptor);

		if (!user || lodash.isEmpty(user)) {
			throw new Error("No se pudo enviar el correo, receptor inválido.");
		}

		const mailOptions = {
			from: `"Kreativa Agency" <${process.env.EMAIL_USER}>`,
			to: user.email,
			subject,
			html: kreativaEmailTemplate(subject, emailContent, null, null),
		};

		await transporter.sendMail(mailOptions);
		console.log("Correo enviado a:", user.email);
		return { success: true };
	} catch (error) {
		console.error("Error al enviar el correo:", error);
		throw new Error("No se pudo enviar el correo.");
	}
};

const sendEmailExterno = async (recipientEmail, emailContent, subject) => {
	try {
		if (!recipientEmail) {
			throw new Error("Correo electrónico no válido.");
		}

		const mailOptions = {
			from: `"Kreativa Agency" <${process.env.EMAIL_USER}>`,
			to: recipientEmail,
			subject,
			html: kreativaEmailTemplate(subject, emailContent, null, null),
		};

		await transporter.sendMail(mailOptions);
		console.log("Correo enviado a:", recipientEmail);
		return { success: true };
	} catch (error) {
		console.error("Error al enviar el correo:", error);
		return { success: false, error: error.message };
	}
};

module.exports = { enviarCorreoRecuperacion, sendEmail, sendEmailExterno };
