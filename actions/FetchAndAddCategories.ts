"use server";
import dbConnect from "@/lib/dbConnect"; // Ensure you have a DB connection utility
import Category from "@/schema/categoriesSchema";
// import Category from "@/models/Category";

// Fetch all categories
export async function fetchCategories() {
  await dbConnect();
  try {
    const categories = await Category.find().sort({ createdAt: -1 }).lean();
    return categories.map((cat) => cat.name);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Add a new category
export async function addCategory(categoryName: string) {
  await dbConnect();
  try {
    if (!categoryName.trim()) throw new Error("Category name cannot be empty");

    // Check if the category already exists
    const existingCategory = await Category.findOne({ name: categoryName });
    if (existingCategory) throw new Error("Category already exists");

    // Create new category
    const newCategory = await Category.create({ name: categoryName });
    return { success: true, category: newCategory.name };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
