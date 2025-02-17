import dbConnect from "@/lib/dbConnect";
import { transactionSchema } from "@/lib/zodSchemas";
import Transaction from "@/schema/TransactionSchema";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const body = await req.json();
        const validatedData = transactionSchema.parse(body); // Validate request body

        const transaction = await Transaction.create(validatedData);
        return NextResponse.json(transaction);
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }

        if (error instanceof mongoose.Error.ValidationError) {
            // This is the Mongoose validation error you're referring to
            console.error("Mongoose Validation Error:", error.message); // Log Mongoose error message
            return NextResponse.json({ error: error.message }, { status: 400 });
          }


        // console.log(error[0]);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET() {
    await dbConnect();
    const transactions = await Transaction.find({});
    return NextResponse.json(transactions);
}