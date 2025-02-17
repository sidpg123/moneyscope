import { Transaction as TransactionType } from "@/state/RecoilState";
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
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
    type: String,
    enum: ["Food", "Transport", "Entertainment", "Shopping", "Bills", "Other", "Salary"],
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

