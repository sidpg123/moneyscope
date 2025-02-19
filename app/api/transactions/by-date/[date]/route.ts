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
        const IST_OFFSET = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
        const selectedDateIST = new Date(selectedDate.getTime() + IST_OFFSET);

        // Get start and end of day in IST
        const startOfDayIST = new Date(selectedDateIST);
        startOfDayIST.setUTCHours(0, 0, 0, 0); // 00:00 IST (which is UTC-5:30)

        const endOfDayIST = new Date(startOfDayIST);
        endOfDayIST.setUTCHours(23, 59, 59, 999); // 23:59:59 IST (which is UTC-5:30)

        console.log("Start Of Day (IST Adjusted):", startOfDayIST);
        console.log("End Of Day (IST Adjusted):", endOfDayIST);
        // Check if the date is valid
        if (isNaN(selectedDate.getTime())) {
            return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
        }

        const transactions = await Transaction.find({
            date: { $gte: startOfDay(selectedDate), $lte: endOfDay(selectedDate) }
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
