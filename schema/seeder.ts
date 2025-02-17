import mongoose from "mongoose"; // Add this line
import dbConnect from "@/lib/dbConnect";
import Transaction from "./TransactionSchema";
import Budget from "./BudgetSchema";




await dbConnect();
const seedTransactions = [
  {
    amount: 500,
    date: new Date("2025-02-16"),
    description: "Dinner at restaurant",
    category: "Food",
    type: "expense",
  },
  {
    amount: 1200,
    date: new Date("2025-02-15"),
    description: "Uber Ride",
    category: "Transport",
    type: "expense",
  },
  {
    amount: 2500,
    date: new Date("2025-02-14"),
    description: "Groceries",
    category: "Shopping",
    type: "expense",
  },
  {
    amount: 10000,
    date: new Date("2025-02-10"),
    description: "Freelance Payment",
    category: "Other",
    type: "income",
  },
];

const seedBudgets = [
  { category: "Food", limit: 5000, month: 2, year: 2025 },
  { category: "Transport", limit: 3000, month: 2, year: 2025 },
  { category: "Shopping", limit: 7000, month: 2, year: 2025 },
];

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Transaction.deleteMany();
    await Budget.deleteMany();

    // Insert new data
    await Transaction.insertMany(seedTransactions);
    await Budget.insertMany(seedBudgets);

    console.log("Database Seeded Successfully! 🚀");
    mongoose.connection.close();
  } catch (error) {
    console.error("Seeder Error:", error);
    mongoose.connection.close();
  }
};

// Run the seeder
seedDatabase();
