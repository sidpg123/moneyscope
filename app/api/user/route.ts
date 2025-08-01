import dbConnect from "@/lib/dbConnect";
import User from "@/schema/UserSchema";
import { NextResponse } from "next/server";

export default async function POST(req: Request, res: Response) {
  await dbConnect();

  try {
    const newUser = await new User({
        name: "Test User",
        email: "test@example.com",
        password: "hashedpassword123",
    });

    await newUser.save();
    return NextResponse.json({ message: "User created successfully!" });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}
