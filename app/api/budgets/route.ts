import dbConnect from "@/lib/dbConnect";
import { budgetSchema } from "@/lib/zodSchemas";
import Budget from "@/schema/BudgetSchema";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const body = await req.json();
        const validatedData = budgetSchema.parse(body);

        const budget = await Budget.create(validatedData);
        return NextResponse.json(budget);
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal server error." }, { status: 400 });
    }
}



export async function GET() {
  await dbConnect();
  const budgets = await Budget.find({});
  return NextResponse.json(budgets);
}
