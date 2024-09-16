"use server";

import mysql2 from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { AppEnvs } from "../read-env";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";
import { books, members, transactions } from "@/db/schema";
import { eq, and, like, or, count, isNotNull } from "drizzle-orm";
import bcrypt from "bcrypt";

const poolConnection = mysql2.createPool({
  uri: AppEnvs.DATABASE_URL,
});
const db = drizzle(poolConnection);

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

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredBooks(
  query: string,
  currentPage: number,
  genre: string
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  let allBooks;
  try {
    // Perform the transaction
    console.log(genre, "genre", "hi");

    if (genre === "all") {
      allBooks = await db.transaction(async (transaction) => {
        // Check for existing members
        const filteredBooks = await transaction
          .select()
          .from(books)
          .where(
            or(
              like(books.title, `%${query}%`),
              like(books.isbnNo, `%${query}%`),
              like(books.publisher, `%${query}%`)
            )
          )

          .limit(ITEMS_PER_PAGE)
          .offset(offset);
        return filteredBooks;
      });
    } else {
      allBooks = await db.transaction(async (transaction) => {
        // Check for existing members
        const filteredBooks = await transaction
          .select()
          .from(books)
          .where(
            and(
              or(
                like(books.title, `%${query}%`),
                like(books.isbnNo, `%${query}%`),
                like(books.publisher, `%${query}%`)
              ),
              eq(books.genre, genre)
            )
          )
          .limit(ITEMS_PER_PAGE)
          .offset(offset);
        return filteredBooks;
      });
    }
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
        id: 0,
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
  genre: string
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
                like(books.publisher, `%${query}%`)
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
