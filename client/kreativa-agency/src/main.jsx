import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext"; // ✅ Importa el AuthProvider
import { HeroUIProvider } from "@heroui/system";
import { FormStatusProvider } from "./context/FormStatusContext.jsx";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<HeroUIProvider>
			<AuthProvider>
				<FormStatusProvider>
					<App />
				</FormStatusProvider>
			</AuthProvider>
		</HeroUIProvider>
	</StrictMode>
);
