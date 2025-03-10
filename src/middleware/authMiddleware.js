const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ mensaje: "Acceso no autorizado. Token no proporcionado." });
    }

    const token = authHeader.split(" ")[1]; // Obtener solo el token

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded; // Guardar datos del usuario en req.usuario
        next(); // Continuar con la siguiente función
    } catch (error) {
        return res.status(401).json({ mensaje: "Token inválido o expirado." });
    }
};

module.exports = verificarToken;