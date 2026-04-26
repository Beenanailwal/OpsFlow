import express from "express"
import { protect, adminOnly } from "../middleware/authMiddleware.js"
import { getAllUsers, deleteUser, changeUserRole } from "../controllers/adminController.js"
import { getAllOrders } from "../controllers/orderController.js"

const router = express.Router()

router.get("/users", protect, adminOnly, getAllUsers)

router.delete("/users/:id", protect, adminOnly, deleteUser)

router.get("/orders", protect, adminOnly, getAllOrders)

router.put("/users/:id/role", protect, adminOnly, changeUserRole)

export default router