import { jwtDecode } from "jwt-decode";

const validTokenActive = () => {
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

export default validTokenActive;
