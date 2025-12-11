import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
  quantity: Number,
  price: Number
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  items: [orderItemSchema],
  total: Number,
  status: { type: String, default: "paid" },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("order", orderSchema);
export default Order;
