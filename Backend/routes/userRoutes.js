import express from "express"
import { registerUser, loginUser } from "../controllers/userController.js"
import upload from "../middleware/upload.js"
import { uploadProfileImage } from "../controllers/userController.js"
import protect from "../middleware/authMiddleware.js"
import rateLimit from "express-rate-limit"

const router = express.Router()

const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many login attempts. Please try again after 5 minutes."
  }
})

router.post("/register", registerUser)
router.post("/login", loginLimiter, loginUser)
router.post("/upload", protect, upload.single("image"), uploadProfileImage)

export default router