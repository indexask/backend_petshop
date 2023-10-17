const express = require("express")
const router = require("./routes/routes.js")
const cors = require("cors")

const app = express()

const port = process.env.PORT || 3000

app.use(express.json())

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
}
app.use(cors(corsOptions))

app.use(
  "/",
  router,
  cors({
    origin: "http://localhost:5173",
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
