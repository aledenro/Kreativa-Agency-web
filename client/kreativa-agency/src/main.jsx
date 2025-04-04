import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HeroUIProvider } from "@heroui/system"; // ✅
import { AuthProvider } from "./context/AuthContext"; // ✅ Importa el AuthProvider
import { HeroUIProvider } from "@heroui/system"; 
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <HeroUIProvider>
            <AuthProvider> 
                <App />
            </AuthProvider>
        </HeroUIProvider>
    </StrictMode>
);