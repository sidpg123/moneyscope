import dbConnect from "@/lib/dbConnect";
import Transaction from "@/schema/TransactionSchema";
import { Transaction as TransactionType  } from "@/state/RecoilState";
import { endOfDay, startOfDay } from "date-fns";

export async function fetchTransactionsByDate(selectedDate: Date): Promise<{
  transactions: TransactionType[];
  totalIncome: number;
  totalExpenses: number;
}> {
  await dbConnect();

  try {
    const transactions = await Transaction.find({
      date: { $gte: startOfDay(selectedDate), $lte: endOfDay(selectedDate) },
    })
      .populate("category", "name")
      .lean();

    const formattedTransactions: TransactionType[] = transactions.map((txn) => ({
      _id: String(txn._id), // Ensure _id is string
      amount: txn.amount,
      description: txn.description || "", // Avoid undefined errors
      date: txn.date,
      type: txn.type,
      category: txn.category?.name || "Unknown",
    }));

    const totalIncome = formattedTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = formattedTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      transactions: formattedTransactions,
      totalIncome,
      totalExpenses,
    };
  } catch (error) {
    console.error("Error fetching transactions by date:", error);
    return { transactions: [], totalIncome: 0, totalExpenses: 0 };
  }
}
