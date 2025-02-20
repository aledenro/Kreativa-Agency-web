const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ mensaje: "Acceso denegado. No hay token." });
    }

    try {
        const verificado = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.usuario = verificado; 
        next(); 
    } catch (error) {
        res.status(401).json({ mensaje: "Token no válido" });
    }
};

module.exports = verificarToken;