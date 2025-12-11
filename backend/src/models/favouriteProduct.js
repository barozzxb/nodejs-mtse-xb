import mongoose from "mongoose";

const favSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true, index: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true, index: true },
  createdAt: { type: Date, default: Date.now }
});

favSchema.index({ userId: 1, productId: 1 }, { unique: true }); // tránh duplicate

const Favorite = mongoose.model("favorite", favSchema);
export default Favorite;
