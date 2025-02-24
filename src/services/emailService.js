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
});

const enviarCorreoRecuperacion = async (email, token) => {
    try {
        const mailOptions = {
            from: `"Kreativa Agency" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Recuperación de contraseña - Kreativa Agency",
            html: `
                <h3>Recuperación de contraseña</h3>
                <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                <a href="http://localhost:5173/restablecer/${token}">Restablecer contraseña</a>
                <p>Si no solicitaste este cambio, ignora este mensaje.</p>
            `,
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
            throw new Error("No se pudo enviar el correo, receptor invalido.");
        }

        const email = user.email;
        const mailOptions = {
            from: `"Kreativa Agency" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: subject,
            html: emailContent,
        };

        await transporter.sendMail(mailOptions);
        console.log("Correo enviado a:", email);
        return;
    } catch (error) {
        console.error("Error al enviar el correo:", error);
        throw new Error("No se pudo enviar el correo.");
    }
};

module.exports = { enviarCorreoRecuperacion, sendEmail };
