const jwt = require("jsonwebtoken");
const { verificarUsuarioExistente } = require("../services/usuarioService");
const SessionsService = require("../services/sessionsService");

const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ mensaje: "Acceso no autorizado. Token no proporcionado." });
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

const verificarTokenValidoSesion = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    const token = authHeader.split(" ")[1];

    const userName = authHeader.split(" ")[2];

    try {
        const user = await verificarUsuarioExistente(userName);

        if (!user || lodash.isEmpty(user)) {
            return res.sendStatus(404);
        }

        const sessionFound = await SessionsService.findActiveSessionByUserId(
            user._id
        );

        if (sessionFound.token === token) {
            next();
        }

        return res.status(401).json({ mensaje: "Token usado no valido." });
    } catch (error) {
        return res.sendStatus(500);
    }
};

module.exports = { verificarToken, verificarTokenValidoSesion };
