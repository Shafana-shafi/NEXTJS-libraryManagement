"use server";

import { redirect } from "next/navigation";
import { createBook } from "@/repositories/book.repository";
import { iBook } from "@/models/book.model";

export async function handleAddBook(data: iBook) {
  // Validate form data
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!data.title.trim()) newErrors.title = "Title is required";
    if (!data.author.trim()) newErrors.author = "Author is required";
    if (!data.publisher.trim()) newErrors.publisher = "Publisher is required";
    if (!data.isbnNo.trim()) newErrors.isbnNo = "ISBN is required";
    if (data.pages <= 0) newErrors.pages = "Pages must be greater than 0";
    if (data.totalCopies <= 0)
      newErrors.totalCopies = "Total Copies must be greater than 0";
    return newErrors;
  };

  const newErrors = validateForm();
  if (Object.keys(newErrors).length > 0) {
    return { success: false, errors: newErrors };
  }

  try {
    console.log(data);
    const result = await createBook(data);
    if (result) {
      redirect("/userBooks");
    }
  } catch (error) {
    console.error("Failed to add book:", error);
    return { success: false, error: "Failed to add book" };
  } finally {
    redirect("/adminBooks");
  }
}
