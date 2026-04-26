import express from "express"
import { registerUser, loginUser } from "../controllers/userController.js"
import upload from "../middleware/upload.js"
import { uploadProfileImage } from "../controllers/userController.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/upload", protect, upload.single("image"), uploadProfileImage)

export default router