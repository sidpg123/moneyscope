import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
export default Category;
