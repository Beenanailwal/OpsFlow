import mongoose from "mongoose";

const inventoryLogSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  change: { type: Number, required: true }, // +ve or -ve
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  note: { type: String }
}, { timestamps: true });

const InventoryLog = mongoose.model("InventoryLog", inventoryLogSchema, "inventory_logs");

export default InventoryLog;