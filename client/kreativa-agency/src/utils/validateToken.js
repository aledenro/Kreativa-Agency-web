import { jwtDecode } from "jwt-decode";
import axios from "axios"
import { update } from "lodash";

export const validTokenActive = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        return false;
    }

    const decoded = jwtDecode(token);

    const valid = decoded.exp * 1000 > Date.now();

    if (!valid) {
        localStorage.clear();
    }

    return valid;
};

export const updateSessionStatus = async() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user_name");
        
    try {
        const response = await axios.put(
            `${import.meta.env.VITE_API_URL}/sessions/token`,
            {   username: user,
                motivo: "Token vencido",
                token: token
            }
        );

    }catch(error){
        throw new Error("Error al actualizar la sesion.")
    }
}

const TokenUtils = { validTokenActive, updateSessionStatus };
export default TokenUtils;
