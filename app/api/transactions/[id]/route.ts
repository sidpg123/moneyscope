import dbConnect from "@/lib/dbConnect";
import { transactionSchema } from "@/lib/zodSchemas";
import Transaction from "@/schema/TransactionSchema";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    
    try {
      const body = await req.json();
      const validatedData = transactionSchema.parse(body);
  
      const updatedTransaction = await Transaction.findByIdAndUpdate(params.id, validatedData, { new: true });
      return NextResponse.json(updatedTransaction);
    } catch (error) {
        if(error instanceof ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
      return NextResponse.json({ error: "Internal server error." }, { status: 400 });
    }
  }
  

  export async function GET(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    const transaction = await Transaction.findById(params.id);
    return NextResponse.json(transaction);
  }

  export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    await Transaction.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Transaction deleted" });
  }
  