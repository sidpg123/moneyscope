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

  let filter: any = { type: "expense" }; // Only expenses for pie chart

  if (startDate && endDate) {
    filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  } else if (year && month) {
    const start = new Date(`${year}-${month}-01T00:00:00.000Z`);
    const end = new Date(`${year}-${month}-31T23:59:59.999Z`);
    filter.date = { $gte: start, $lte: end };
  }

  const categoryBreakdown = await Transaction.aggregate([
    { $match: filter },
    {
      $group: {
        _id: "$category",
        totalAmount: { $sum: "$amount" },
      },
    },
    { $sort: { totalAmount: -1 } },
  ]);

  return NextResponse.json(categoryBreakdown);
}
