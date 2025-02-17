import { z } from "zod";

export const transactionSchema = z.object({
  amount: z.number().min(1, "Amount must be at least 1"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }).optional(),
  description: z.string().min(3, "Description must be at least 3 characters"),
  category: z.string().min(2, "Category must be at least 2 characters"),
  type: z.enum(["income", "expense"], {
    message: "Type must be either 'income' or 'expense'",
  }),
});

export const budgetSchema = z.object({
  category: z.string().min(2, "Category must be at least 2 characters"),
  limit: z.number().min(100, "Budget limit must be at least 100"),
  month: z.number().min(1).max(12, "Month must be between 1 and 12"),
  year: z.number().min(2000).max(2100, "Year must be reasonable"),
});
