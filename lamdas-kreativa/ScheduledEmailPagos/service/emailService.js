const nodemailer = require("nodemailer");

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

const sendEmail = async (pago) => {
    try {
        const email = pago.usuario.email;
        const mailOptions = {
            from: `"Kreativa Agency" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Tiene un pago pendiente sobre: ${pago.titulo}`,
            html: `<p>Correo pagos</p>`,
        };

        await transporter.sendMail(mailOptions);
        console.log("Correo enviado a:", email);
        return;
    } catch (error) {
        console.error("Error al enviar el correo:", error);
        throw new Error("No se pudo enviar el correo.");
    }
};

module.exports = sendEmail;
