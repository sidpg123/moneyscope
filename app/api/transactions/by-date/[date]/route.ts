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
        const selectedDateIST = new Date(params.date); // Assume it's in IST
        let startOfDayUTC;
        let endOfDayUTC;

        console.log("Original selectedDate (IST assumed):", selectedDateIST.toISOString());

        if (process.env.ENVIRONMENT === 'DEV') {
            startOfDayUTC = startOfDay(selectedDateIST);
            endOfDayUTC = endOfDay(selectedDateIST);

            console.log("selectedDate", selectedDateIST)
            console.log("start Of Day", startOfDay(selectedDateIST))
            console.log("start Of Day", endOfDay(selectedDateIST))
        } else {

            await selectedDateIST.setHours(0, 0, 0, 0);
    
            // Convert IST to UTC by subtracting 5 hours 30 minutes
            const selectedDateUTC = new Date(selectedDateIST.getTime() - (5.5 * 60 * 60 * 1000));
    
             startOfDayUTC = startOfDay(selectedDateUTC);
             endOfDayUTC = endOfDay(selectedDateUTC);
    
            console.log("startOfDayUTC", startOfDayUTC)
            console.log("endOfDayUTC", endOfDayUTC)
        }

       
        // Check if the date is valid
        if (isNaN(selectedDateIST.getTime())) {
            return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
        }

        const transactions = await Transaction.find({
            date: { $gte: startOfDayUTC, $lte: endOfDayUTC }
        })
        .sort({createdAt: -1})
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
