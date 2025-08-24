const jwt = require("jsonwebtoken");
const { verificarUsuarioExistente } = require("../services/usuarioService");
const SessionsService = require("../services/sessionsService");
const lodash = require("lodash");

const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ mensaje: "Acceso no autorizado. Token no proporcionado." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: "Token inválido o expirado." });
  }
};

const verificarTokenValidoSesion = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const userName = req.headers.user;

  const token = authHeader.split(" ")[1];

  try {
    const user = await verificarUsuarioExistente(userName);

    if (!user || lodash.isEmpty(user)) {
      return res.sendStatus(404);
    }

    const sessionFound = await SessionsService.getActiveSessionByUserId(
      user._id
    );

    if (sessionFound.token === token) {
      next();
      return;
    }

    return res.status(401).json({ mensaje: "Token usado no valido." });
  } catch (error) {
    console.log(error.message);

    return res.sendStatus(500);
  }
};

module.exports = { verificarToken, verificarTokenValidoSesion };
