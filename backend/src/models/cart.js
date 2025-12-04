import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    name: String,
    productId: String,
    price: Number,
    quantity: Number,
    createdAt: { type: Date, default: Date.now }
})

const Cart = mongoose.model("cart", cartSchema);
export default Cart;