const jwt = require("jsonwebtoken")
require("dotenv").config()

const checkCredentialsExist = (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    res
      .status(401)
      .json({ message: "No se recibieron las credenciales en esta consulta" })
  }
  next()
}

const tokenVerification = (req, res, next) => {
  const authorizationHeader = req.header("Authorization")
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Debe incluir un token de autenticación válido" })
  }

  const token = authorizationHeader.split("Bearer ")[1]

  try {
    const validToken = jwt.verify(token, process.env.SECRET)
    if (validToken) {
      next()
    } else {
      res.status(401).json({ message: "El token es inválido" })
    }
  } catch (error) {
    console.error("Error al verificar el token:", error)
    res.status(401).json({ message: "El token es inválido" })
  }
}

module.exports = { checkCredentialsExist, tokenVerification }
