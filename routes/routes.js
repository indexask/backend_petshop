const express = require("express")
const jwt = require("jsonwebtoken")
const router = express.Router()
require("dotenv").config()

const {
  getUserProducts,
  registration,
  obtainUser,
  verifyUser,
  getProducts,
  getProductByCategory,
  getCartProducts,
  createProduct,
  allUsers,
} = require("../consultas/consultas")
const {
  checkCredentialsExist,
  tokenVerification,
} = require("../middleware/middleware")

router.get("/", (req, res) => {
  res.send("Hello World")
})

router.post("/usuarios", checkCredentialsExist, async (req, res) => {
  try {
    const usuarios = req.body
    await registration(usuarios)
    res.send("Usuario registrado con éxito!")
  } catch (error) {
    res.status(500).send(error)
  }
})

router.get("/usuarios", tokenVerification, async (req, res) => {
  try {
    const Authorization = req.header("Authorization")
    const token = Authorization.split("Bearer ")[1]
    const { email } = jwt.decode(token)
    const usuario = await obtainUser(email)
    res.json(usuario)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.get("/todos", async (req, res) => {
  try {
    const usuarios = await allUsers()
    res.json(usuarios)
  } catch (error) {
    res.status(500).send(error)
  }
})


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const userId = await verifyUser(email, password)

    const token = jwt.sign({ email, user_id: userId }, process.env.SECRET)

    res.json({ email, token, user_id: userId })
  } catch (error) {
    res
      .status(error.code || 500)
      .json({ message: error.message || "Error en el servidor" })
  }
})

router.get("/products", async (req, res) => {
  try {
    const products = await getProducts()
    res.json(products)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.post("/products", async (req, res) => {
  try {
    const productos = req.body
    await createProduct(productos)
    res.send("Producto Agregado con Éxito")
  } catch (error) {
    res.status(500).send(error)
  }
}) 

router.get("/user-posts/:user_id", async (req, res) => {
  try {
    const user_id = req.params.user_id
    const userProducts = await getUserProducts(user_id)
    res.json(userProducts)
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ message: "Error al obtener las publicaciones del usuario" })
  }
})

router.get("/products/category/:category", async (req, res) => {
  try {
    const category = req.params.category
    const products = await getProductByCategory(category)
    res.json(products)
  } catch (error) {
    console.error("Error al procesar la solicitud:", error)

    res.status(500).send(error)
  }
})

router.get("/cart/:userId", async (req, res) => {
  try {
    const userId = req.params.userId
    const cartProducts = await getCartProducts(userId)
    res.json(cartProducts)
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener los productos del carrito de compras" })
  }
})
module.exports = router
