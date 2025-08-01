// Updated Budget Schema
import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Link to User model
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // Link to User model
    required: true,
  },
  limit: {
    type: Number,
    required: true,
  },
  month: {
    type: Number, // 1-12 (January-December)
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Budget = mongoose.models.Budget || mongoose.model("Budget", budgetSchema);
export default Budget;
