const nodemailer = require("nodemailer");
const { renderToString } = require("react-dom/server");
const EmailTemplate = require("../dist/template/EmailTemplate");
const React = require("react");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
    debug: true,
});

const sendEmail = async (pago) => {
    try {
        const email = pago.usuario.email;
        const bodyContent = `Hay un pago pendiente sobre: ${pago.titulo}, cuyo monto es de ₡${pago.monto}. Ingrese a la plataforma para ver más detalles.`;
        const url = `pagos/`;
        const header = "Recordatorio de Pago";
        const btnLabel = "Ingresar";

        const emailJSX = React.createElement(EmailTemplate, {
            header: header,
            content: bodyContent,
            btnLabel: btnLabel,
            accessLink: url,
        });

        const htmlEmail = renderToString(emailJSX);

        const mailOptions = {
            from: `"Kreativa Agency" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Tiene un pago pendiente sobre: ${pago.titulo}`,
            html: htmlEmail,
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
