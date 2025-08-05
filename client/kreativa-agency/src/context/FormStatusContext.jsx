import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const FormStatusContext = createContext();

export const useFormStatus = () => {
	const context = useContext(FormStatusContext);
	if (!context) {
		throw new Error("useFormStatus must be used within a FormStatusProvider");
	}
	return context;
};

export const FormStatusProvider = ({ children }) => {
	const [formActive, setFormActive] = useState(true);
	const [checkingStatus, setCheckingStatus] = useState(true);

	useEffect(() => {
		const checkFormStatus = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/form-status`
				);
				setFormActive(response.data.active);
			} catch (error) {
				console.error("Error al verificar estado del formulario:", error);
				setFormActive(true);
			} finally {
				setCheckingStatus(false);
			}
		};

		checkFormStatus();
	}, []);

	return (
		<FormStatusContext.Provider
			value={{ formActive, checkingStatus, setFormActive }}
		>
			{children}
		</FormStatusContext.Provider>
	);
};
