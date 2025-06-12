import axios from "axios";
import EmailTemplate from "../components/EmailTemplate/EmailTemplate";
import { renderToString } from "react-dom/server";
import React from "react";

const sendEmailExterno = async (recipientEmail, emailContent, subject) => {
    if (!recipientEmail) {
        console.error("No se proporcionó un correo electrónico válido.");
        return false;
    }

    const emailJSX = React.createElement(EmailTemplate, {
        header: subject,
        content: emailContent,
        btnLabel: "",
    });

    const htmlEmail = renderToString(emailJSX);

    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/email/externo`,
            {
                recipientEmail,
                subject,
                emailContent: htmlEmail,
            }
        );

        return response.status === 200;
    } catch (error) {
        console.error("Error al enviar el correo:", error);
        return false;
    }
};

export default sendEmailExterno;
