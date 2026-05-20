import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import cors from "cors"
import { createServer } from "http"
import { Server } from "socket.io"

// routes
import authRoutes from "./routes/userRoutes.js"
import taskRoutes from "./routes/taskRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"

dotenv.config()
connectDB()

const app = express()
const server = createServer(app) 
export const io = new Server(server, { 
  cors: {
    origin: "http://localhost:5173"
  }
})

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
app.use("/uploads", express.static("uploads"))

app.get("/", (req, res) => {
  res.send("API running")
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})