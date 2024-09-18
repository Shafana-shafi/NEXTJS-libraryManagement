"use server";

import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";
import { books, members, transactions } from "@/db/schema";
import {
  eq,
  and,
  like,
  or,
  count,
  isNotNull,
  desc,
  asc,
  SQLWrapper,
  AnyColumn,
  SQL,
} from "drizzle-orm";
import bcrypt from "bcryptjs";
import { PgColumn } from "drizzle-orm/pg-core";

import * as schema from "../db/schema";

export const db = drizzle(sql, { schema });

export async function completeProfile(formData: FormData) {
  const rawFormData = {
    address: formData.get("address"),
    phoneNumber: formData.get("phoneNumber"),
  };

  try {
    // Get the session
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    // Ensure email is defined and not null
    if (!email) {
      console.log("No email found in session");
      return { success: false, message: "No email found in session" };
    }

    // Perform the transaction
    await db.transaction(async (transaction) => {
      // Check for existing members
      const existingMembers = await transaction
        .select()
        .from(members)
        .where(eq(members.email, email))
        .limit(10);

      // Update or handle missing user
      if (existingMembers.length > 0) {
        await transaction
          .update(members)
          .set({
            address: rawFormData.address as string,
            phoneNumber: rawFormData.phoneNumber as string,
          })
          .where(eq(members.email, email));
        return { success: true, message: "Profile updated successfully" };
      } else {
        console.log("No such user");
        return { success: false, message: "No such user" };
      }
    });
    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    console.error("Error updating profile", error);
    return { success: false, message: "Error updating profile" };
  }
}

export async function login(formData: FormData) {}

const ITEMS_PER_PAGE = 8;

export async function fetchFilteredBooks(
  query: string,
  currentPage: number,
  genre: string,
  sort?: string,
  order: "asc" | "desc" = "asc"
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  let new_query;
  let allBooks;
  try {
    let baseQuery = db
      .select()
      .from(books)
      .where(
        and(
          or(
            like(books.title, `%${query}%`),
            like(books.isbnNo, `%${query}%`),
            like(books.publisher, `%${query}%`),
            like(books.author, `%${query}%`),
            like(books.availableCopies, `%${query}%`),
            like(books.price, `%${query}%`)
          ),
          genre !== "all" ? eq(books.genre, genre) : undefined
        )
      )
      .limit(ITEMS_PER_PAGE)
      .offset(offset);

    // Apply sorting if a sort field is provided
    if (sort && sort in books) {
      const sortField = books[sort as keyof typeof books] as PgColumn;
      const orderBy: SQL = order === "desc" ? desc(sortField) : asc(sortField);
      new_query = baseQuery.orderBy(orderBy);
      allBooks = await new_query;
    } else {
      allBooks = await baseQuery;
    }
    console.log("hi");
    return allBooks;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch books.");
  }
}

export async function fetchFilteredBooksForUsers(
  query: string,
  currentPage: number,
  genre: string
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    let baseQuery = db
      .select()
      .from(books)
      .where(
        and(
          or(
            like(books.title, `%${query}%`),
            like(books.isbnNo, `%${query}%`),
            like(books.publisher, `%${query}%`)
          ),
          genre !== "all" ? eq(books.genre, genre) : undefined
        )
      )
      .limit(ITEMS_PER_PAGE)
      .offset(offset);

    const allBooks = await baseQuery;

    return allBooks;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch books.");
  }
}

export async function register(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstname") as string;
  const lastName = formData.get("lastname") as string;

  try {
    // Check if user already exists
    const existingMembers = await db
      .select()
      .from(members)
      .where(eq(members.email, email))
      .execute();

    if (existingMembers.length > 0) {
      return { success: false, message: "User already exists. Please log in." };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await db
      .insert(members)
      .values({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
        role: "user",
        phoneNumber: null,
        address: null,
        membershipStatus: "active",
      })
      .execute();

    return { success: true, message: "Registration successful." };
  } catch (error) {
    console.error("Error during registration:", error);
    return {
      success: false,
      message: "Registration failed. Please try again.",
    };
  }
}

export async function getUserByEmail(email: string) {
  try {
    const selectedMember = await db
      .select()
      .from(members)
      .where(eq(members.email, email))
      .execute();
    return selectedMember.length > 0 ? selectedMember[0] : undefined;
  } catch (error) {
    console.error("Error retrieving member by email:", error);
    throw error;
  }
}

export async function fetchFilteredTransactions(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    // Get the session
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    // Perform the transaction
    const transList = await db.transaction(async (transaction) => {
      // Query transactions joined with members and books
      const transactionList = await transaction
        .select({
          id: transactions.id,
          borrowDate: transactions.borrowDate,
          returnDate: transactions.returnDate,
          memberFirstName: members.firstName,
          memberLastName: members.lastName,
          bookTitle: books.title,
        })
        .from(transactions)
        .innerJoin(members, eq(transactions.memberId, members.id))
        .innerJoin(books, eq(transactions.bookId, books.id))
        .where(
          and(
            or(
              like(members.firstName, `%${query}%`),
              like(members.lastName, `%${query}%`),
              like(books.title, `%${query}%`)
            ),
            // Add null checks for memberId and bookId
            isNotNull(transactions.memberId),
            isNotNull(transactions.bookId)
          )
        )
        .limit(ITEMS_PER_PAGE)
        .offset(offset);

      return transactionList;
    });

    return transList;
  } catch (error) {
    console.error("Error fetching filtered transactions", error);
    throw error;
  }
}

export async function fetchPaginatedBooks(
  query: string,
  genre: string,
  sort?: string,
  order: "asc" | "desc" = "asc"
): Promise<number> {
  try {
    const totalPages = await db.transaction(async (transaction) => {
      let bookCountResult;
      // Count the total number of books matching the query
      if (genre === "all") {
        bookCountResult = await transaction
          .select({ count: count() })
          .from(books);
      } else {
        bookCountResult = await transaction
          .select({ count: count() })
          .from(books)
          .where(
            and(
              or(
                like(books.title, `%${query}%`),
                like(books.isbnNo, `%${query}%`),
                like(books.publisher, `%${query}%`),
                like(books.author, `%${query}%`),
                like(books.price, `%${query}%`),
                like(books.availableCopies, `%${query}%`)
              ),
              eq(books.genre, genre)
            )
          );
        console.log(bookCountResult, "book count result");
      }
      // Extract count from the result
      const bookCount = bookCountResult[0]?.count || 0;
      const totalBooks = Number(bookCount);

      if (isNaN(totalBooks)) {
        console.error("Invalid book count:", bookCount);
        return 0;
      }

      // Calculate the total number of pages
      const totalPages = Math.ceil(totalBooks / ITEMS_PER_PAGE);

      return totalPages;
    });

    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    return 0; // Ensure that a valid number is returned in case of an error
  }
}
