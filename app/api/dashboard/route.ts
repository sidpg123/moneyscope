import dbConnect from "@/lib/dbConnect";
import Transaction from "@/schema/TransactionSchema";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const year = searchParams.get("year");
  const month = searchParams.get("month");
  const day = searchParams.get("day");

  interface Filter {
    date?: { $gte: Date, $lte: Date };
  }
  
  const filter: Filter = {};

  if (startDate && endDate) {
    filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  } else if (year && month && day) {
    // Filter by specific day
    const start = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
    const end = new Date(`${year}-${month}-${day}T23:59:59.999Z`);
    filter.date = { $gte: start, $lte: end };
  } else if (year && month) {
    // Filter by specific month
    const start = new Date(`${year}-${month}-01T00:00:00.000Z`);
    const end = new Date(`${year}-${month}-31T23:59:59.999Z`);
    filter.date = { $gte: start, $lte: end };
  }

  const transactions = await Transaction.find(filter);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return NextResponse.json({
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    transactions, // Return filtered transactions
  });
}
