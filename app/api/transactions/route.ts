import dbConnect from "@/lib/dbConnect";
import { transactionSchema } from "@/lib/zodSchemas";
import Category from "@/schema/categoriesSchema";
import Transaction from "@/schema/TransactionSchema";
import { endOfDay, startOfDay } from "date-fns";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import z from "zod";

// const transactionSchema = z.object({
//     amount: z.number().min(1, "Amount must be at least 1"),
//     description: z.string().min(3, "Description must be at least 3 characters"),
//     category: z.string().min(1, "Category is required"), // Accept category name as string
//     type: z.enum(["income", "expense"]),
//   });

export async function POST(req: Request) {
    await dbConnect();
        
    try {
        const body = await req.json();
        const validatedData = transactionSchema.parse(body); // Validate request body

        // Check if the category exists
        const categoryDoc = await Category.findOne({ name: validatedData.category });

        if (!categoryDoc) {
            return NextResponse.json({ error: "Category not found" }, { status: 400 });
        }

        // Create the transaction with the category reference
        const transaction = await Transaction.create({
            ...validatedData,
            category: categoryDoc._id, // Store ObjectId reference
        });

        return NextResponse.json(transaction, { status: 201 });
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }

        if (error instanceof mongoose.Error.ValidationError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        console.error("Internal Server Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// export async function GET() {
//     await dbConnect();
//     const transactions = await Transaction.find({});
//     return NextResponse.json(transactions);
// }
