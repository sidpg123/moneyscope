"use server";
import dbConnect from "@/lib/dbConnect";
import Transaction from "@/schema/TransactionSchema";
import { startOfDay, endOfDay } from "date-fns";

export async function fetchTransactionsByDate(selectedDate: Date) {
  await dbConnect();

  const transactions = await Transaction.find({
    date: { $gte: startOfDay(selectedDate), $lte: endOfDay(selectedDate) }
  });

  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return { transactions, totalIncome, totalExpenses };
}
