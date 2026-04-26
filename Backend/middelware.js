import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import cors from "cors"

// routes
import authRoutes from "./routes/userRoutes.js"
import taskRoutes from "./routes/taskRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"

dotenv.config()
connectDB()

const app = express()

app.use(express.json())

app.use(cors({
  origin: "http://localhost:5173"
}))

// ROUTES
app.use("/api/auth", authRoutes)
app.use("/api/tasks", taskRoutes)
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/admin", adminRoutes)

app.get("/", (req, res) => {
  res.send("API running")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})