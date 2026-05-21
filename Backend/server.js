import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import helmet from "helmet"
import { createServer } from "http"
import { Server } from "socket.io"
import cartRoutes from "./routes/cartRoutes.js"

// DB
import connectDB from "./config/db.js"

// Routes
import authRoutes from "./routes/userRoutes.js"
import taskRoutes from "./routes/taskRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"

// Load env
dotenv.config()

// Connect DB
connectDB()

// App init
const app = express()
const server = createServer(app)

// Socket setup
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173"
  }
})

/* ---------------- MIDDLEWARES ---------------- */
app.use(cors({
  origin: "http://localhost:5173"
}))

app.use(helmet({crossOriginResourcePolicy: { policy: "cross-origin" }})) // security

app.use(express.json())

app.use("/uploads", express.static("uploads"))

/* ---------------- ROUTES ---------------- */
app.use("/api/auth", authRoutes)
app.use("/api/tasks", taskRoutes)
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/cart", cartRoutes)

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
  res.send("API running 🚀")
})

/* ---------------- SERVER START ---------------- */
const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})