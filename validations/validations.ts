// validation.ts
import { z } from "zod";

export const bookSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .regex(/^[a-zA-Z\s]+$/, "Title cannot contain special characters"),
  publisher: z
    .string()
    .min(2, "Publisher must be at least 2 characters")
    .regex(/^[a-zA-Z\s]+$/, "Publisher cannot contain special characters"),
  author: z
    .string()
    .min(2, "Author must be at least 2 characters")
    .regex(/^[a-zA-Z\s]+$/, "Author cannot contain special characters"),
  genre: z
    .string()
    .min(2, "Genre must be at least 2 characters")
    .regex(/^[a-zA-Z\s]+$/, "Genre cannot contain special characters"),
  isbnNo: z
    .string()
    .length(10, "ISBN must be exactly 10 digits")
    .regex(/^\d{10}$/, "ISBN must be a 10-digit number"),
  pages: z.number().min(1, "Pages must be greater than 0"),
  totalCopies: z.number().min(1, "Total Copies must be greater than 0"),
  price: z.number().min(1, "price must be greater than 0"),
});

export const memberSchema = z.object({
  firstName: z
    .string()
    .min(2, "First Name must be at least 2 characters")
    .regex(/^[a-zA-Z\s]+$/, "First Name cannot contain special characters"),
  lastName: z
    .string()
    .min(2, "Last Name must be at least 2 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last Name cannot contain special characters"),
  email: z.string().email("Must be a valid email address"),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, "Phone Number must be a 10-digit number"),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .optional(),
});

export const professorSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name cannot contain special characters"),
  email: z
    .string()
    .email("Must be a valid email address")
    .min(5, "Email must be at least 5 characters"),
  department: z
    .string()
    .min(2, "Department must be at least 2 characters")
    .regex(/^[a-zA-Z\s]+$/, "Department cannot contain special characters"),
  bio: z.string().min(5, "Bio must be at least 5 characters").optional(),
  calendlyLink: z
    .string()
    .min(5, "link must be at least 5 characters")
    .optional(),
});
