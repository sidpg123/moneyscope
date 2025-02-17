import dbConnect from "@/lib/dbConnect";
import Transaction from "@/schema/TransactionSchema";
import { NextResponse } from "next/server";
import { z, ZodError } from "zod";

// Define the Zod schema for a single transaction
const transactionSchema = z.object({
  amount: z.number(),
  date: z.string().datetime(), // ISO Date format
  description: z.string(),
  category: z.string(),
  type: z.enum(["income", "expense"]),
});

// Define the schema for bulk transactions (array of transactions)
const bulkTransactionSchema = z.array(transactionSchema);

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const validatedData = bulkTransactionSchema.parse(body); // Validate array of transactions

    const transactions = await Transaction.insertMany(validatedData);
    return NextResponse.json({ success: true, transactions });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
