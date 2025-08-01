import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(5, { message: "Must be 5 or more characters long" }),
});

export const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string(),
});