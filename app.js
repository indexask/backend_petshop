const express = require("express")
const router = require("./routes/routes.js")
const cors = require("cors")

const app = express()

const port = 5432 || 3000

app.use(express.json())

const corsOptions = {
  origin: "https://652e25cfbb5e1044e580c608--earnest-lily-3d69bf.netlify.app/",
  credentials: true,
}
app.use(cors(corsOptions))

app.use(
  "/",
  router,
  cors({
    origin: "https://652e25cfbb5e1044e580c608--earnest-lily-3d69bf.netlify.app/",
    credentials: true,
  })
)
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: err.message })
})

app.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`)
})
