import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
    category: {
      type: String,
      enum: ["Food", "Transport", "Entertainment", "Shopping", "Bills", "Other"],
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
  
  const Budget = mongoose.model("Budget", budgetSchema);
  export default Budget;
  