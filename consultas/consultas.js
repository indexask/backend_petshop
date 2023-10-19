const pool = require("../db/conexion")
const bcrypt = require("bcryptjs")

const registration = async (usuario) => {
  let { username, email, password } = usuario
  const passwordEncoded = bcrypt.hashSync(password)
  password = passwordEncoded
  const values = [username, email, passwordEncoded]
  const consult = `INSERT INTO users VALUES (DEFAULT,$1, $2, $3)`
  await pool.query(consult, values)
}

const obtainUser = async (email) => {
  const values = [email]
  const consult = `SELECT * FROM users WHERE email = $1`

  const {
    rows: [usuario],
    rowCount,
  } = await pool.query(consult, values)

  if (!rowCount) {
    throw {
      code: 404,
      message: "Usuario no encontrado",
    }
  }
  delete usuario.password
  return usuario
}

const allUsers = async () => {
  const consult = `SELECT * FROM users`
  const { rows } = await pool.query(consult)
  return rows
}

const getUserProducts = async (user_id) => {
  const query = `SELECT * FROM productos WHERE user_id = $1`
  const values = [user_id]
  const { rows } = await pool.query(query, values)
  return rows
}

const verifyUser = async (email, password) => {
  const values = [email]
  const consult = ` SELECT user_id, password FROM users WHERE email = $1`

  const {
    rows: [usuario],
    rowCount,
  } = await pool.query(consult, values)

  if (!rowCount) {
    throw {
      code: 404,
      message: "Usuario no encontrado",
    }
  }

  const { user_id, password: passwordEncoded } = usuario
  const correctPassword = bcrypt.compareSync(password, passwordEncoded)

  if (!correctPassword || !rowCount) {
    throw { code: 401, message: "Contraseña o email es incorrecto" }
  }
  return user_id
}

const getProducts = async () => {
  const consult = `SELECT * FROM productos`
  const { rows } = await pool.query(consult)
  return rows
}

const createProduct = async (product) => {
  let { img, title, description, price, categoria, stock, user_id } = product
  const values = [img, title, description, price, categoria, stock, user_id]
  const consult = `INSERT INTO productos VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7)`
  await pool.query(consult, values)
}

const postId = async (id) => {
  const values = [id]
  const consult = `select * from productos where id = ($1)`
  const { rows } = await pool.query(consult, values)
  return rows
}

const getProductByCategory = async (category) => {
  const query = `SELECT * FROM productos WHERE categoria = $1`
  const values = [category]
  const { rows } = await pool.query(query, values)
  return rows
}

const getCartProducts = async (userId) => {
  const query = `
    SELECT products.product_id, products.product_name, products.product_price, cart.quantity
    FROM cart
    JOIN products ON cart.product_id = products.id
    WHERE cart.user_id = $1
  `
  const values = [userId]
  const { rows } = await pool.query(query, values)
  return rows
}

module.exports = {
  registration,
  obtainUser,
  verifyUser,
  getProducts,
  getProductByCategory,
  getCartProducts,
  createProduct,
  postId,
  allUsers,
  getUserProducts,
}
