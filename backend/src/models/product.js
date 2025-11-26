import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: String,
    genre: String,
    description: String,
    price: Number,
    brand: String,
    createdAt: { type: Date, default: Date.now }
})

productSchema.index({genre: 1, createdAt: -1});

const Product = mongoose.model("product", productSchema);
export default Product;