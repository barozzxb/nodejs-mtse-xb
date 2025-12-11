import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true, index: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true, index: true },
  text: { type: String, required: true },
  rating: { type: Number, min: 0, max: 5 },
  createdAt: { type: Date, default: Date.now }
});

const Comment = mongoose.model("comment", commentSchema);
export default Comment;
