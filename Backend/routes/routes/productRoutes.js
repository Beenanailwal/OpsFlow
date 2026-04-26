import express from "express"
import { addProduct, getProducts, updateProduct, deleteProduct, updateStock } from "../controllers/productController.js"
import {protect,adminOnly} from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/", protect, getProducts);                 // any logged-in user
router.post("/", protect, adminOnly, addProduct);      // admin only
router.put("/:id", protect, adminOnly, updateProduct);// admin only
router.delete("/:id", protect, adminOnly, deleteProduct); // admin only
router.put("/stock/:id", protect, adminOnly, updateStock); // Admin only

export default router