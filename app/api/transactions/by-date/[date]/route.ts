import { startOfDay, endOfDay } from "date-fns";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Transaction from "@/schema/TransactionSchema";
import Category from "@/schema/categoriesSchema";

export async function GET(req: Request, { params }: { params: { date: string } }) {
    
    try {
        await dbConnect();

        if (!Category) {
            console.warn("Category model is not loaded");
        }

        // Convert string date to Date object
        const selectedDate = new Date(params.date);

        const selectedDateUTC = new Date(Date.UTC(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate()
        ));

        const startOfDayUTC = startOfDay(selectedDateUTC);
        const endOfDayUTC = endOfDay(selectedDateUTC);
        // Check if the date is valid
        if (isNaN(selectedDate.getTime())) {
            return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
        }

        const transactions = await Transaction.find({
            date: { $gte: startOfDayUTC, $lte: endOfDayUTC }
        })
            .populate("category", "name")
            .lean();

        const totalIncome = transactions
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = transactions
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0);

        return NextResponse.json({
            transactions: transactions.map((txn) => ({
                ...txn,
                category: txn.category?.name || "Unknown",
            })),
            totalIncome,
            totalExpenses,
        });
    } catch (error) {
        console.error("Error fetching transactions by date:", error);
        return NextResponse.json({ transactions: [], totalIncome: 0, totalExpenses: 0 });
    }
}
