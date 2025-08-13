import axios from "axios";
import EmailTemplate from "../components/EmailTemplate/EmailTemplate";
import { renderToString } from "react-dom/server";
import React from "react";

const sendEmail = async (
	idReceptor,
	emailContent,
	subject,
	btnLabel,
	accessLink
) => {
	const emailJSX = React.createElement(EmailTemplate, {
		header: subject,
		content: emailContent,
		btnLabel: btnLabel,
		accessLink: accessLink,
	});

	const htmlEmail = renderToString(emailJSX);

	try {
		const data = {
			idReceptor: idReceptor,
			subject: subject,
			emailContent: htmlEmail,
		};
		const response = await axios.post(
			`${import.meta.env.VITE_API_URL}/email`,
			data
		);

		if (response.status === 200) {
			return true;
		}
	} catch (error) {
		console.error(error.message);
	}
};

export default sendEmail;
