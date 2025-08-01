import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: () => new Date(),
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // References the Category model
    required: true,
  },
  type: {
    type: String,
    enum: ["income", "expense"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);
export default Transaction;
