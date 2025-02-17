import dbConnect from "@/lib/dbConnect";
import Category from "@/schema/categoriesSchema";
import Transaction from "@/schema/TransactionSchema";
// import Category from "@/schema/CategorySchema";
import { NextResponse } from "next/server";
import { z, ZodError } from "zod";

// Define the Zod schema for a single transaction
const transactionSchema = z.object({
  amount: z.number().min(1, "Amount must be at least 1"),
  date: z.string().datetime(), // Expecting an ISO Date string
  description: z.string().min(3, "Description must be at least 3 characters"),
  category: z.string().min(1, "Category is required"), // Accepts category name
  type: z.enum(["income", "expense"]),
});

// Define schema for bulk transactions (array of transactions)
const bulkTransactionSchema = z.array(transactionSchema);

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const validatedData = bulkTransactionSchema.parse(body); // Validate array of transactions

    // Get unique category names from the input transactions
    const categoryNames = [...new Set(validatedData.map((t) => t.category))];

    // Fetch corresponding category documents
    const categoryDocs = await Category.find({ name: { $in: categoryNames } });

    // Map category names to their respective ObjectIds
    const categoryMap = new Map(categoryDocs.map((cat) => [cat.name, cat._id]));

    // Validate that all categories exist
    for (const name of categoryNames) {
      if (!categoryMap.has(name)) {
        return NextResponse.json({ error: `Category '${name}' not found` }, { status: 400 });
      }
    }

    // Convert transactions to store category ObjectIds instead of names
    const transactionsToInsert = validatedData.map((t) => ({
      ...t,
      category: categoryMap.get(t.category), // Replace category name with ObjectId
      date: new Date(t.date), // Convert ISO string to Date object
    }));

    // Insert transactions into the database
    const transactions = await Transaction.insertMany(transactionsToInsert);

    return NextResponse.json({ success: true, transactions });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
