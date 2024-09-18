"use server";

import mysql2 from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/authOptions";
import { books, members, transactions } from "@/db/schema";
import { eq, and, like, or, count } from "drizzle-orm";
import chalk from "chalk";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { iBook, iBookB, iBookBase } from "@/models/book.model";

const poolConnection = mysql2.createPool({
  uri: process.env.DATABASE_URL,
});
const db = drizzle(poolConnection);

/**
 * Creates a new book or updates an existing one if it already exists.
 * @param {iBookBase} data - The book data to create.
 * @returns {Promise<iBook>}
 */
export async function createBook(book: iBook): Promise<iBookB | undefined> {
  try {
    // Check if the book already exists
    const existingBooks = await db
      .select()
      .from(books)
      .where(and(eq(books.isbnNo, book.isbnNo), eq(books.title, book.title)))
      .limit(10)
      .execute();

    if (existingBooks.length > 0) {
      // Update existing book
      const existingBook = existingBooks[0];
      const updatedTotalCopies = existingBook.totalCopies + book.totalCopies;
      const updatedAvailableCopies =
        existingBook.availableCopies + book.totalCopies;

      await db
        .update(books)
        .set({
          totalCopies: updatedTotalCopies,
          availableCopies: updatedAvailableCopies,
        })
        .where(and(eq(books.isbnNo, book.isbnNo), eq(books.title, book.title)))
        .execute();

      const updatedBook: iBookB = {
        ...existingBook,
        totalCopies: updatedTotalCopies,
        availableCopies: updatedAvailableCopies,
      };

      console.log("---BOOK ALREADY EXISTED, INCREASED NUMBER OF COPIES---");
      return updatedBook;
    } else {
      // Insert new book
      const newBookData: iBookB = {
        ...book,
        availableCopies: book.totalCopies,
        price: book.price,
      };

      await db.insert(books).values(newBookData).execute();

      console.log(chalk.green("Book added successfully\n"));
      return newBookData;
    }
  } catch (error) {
    console.error("Error creating book:", error);
    throw error;
  }
}

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

const ITEMS_PER_PAGE = 5;
export async function fetchFilteredBooks(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    // Perform the transaction
    const allBooks = await db.transaction(async (transaction) => {
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

    // Ensure email is defined and not null
    // if (!email) {
    //   console.log("No email found in session");
    //   return { success: false, message: "No email found in session" };
    // }

    const user = await getUserByEmail(email!);
    const userId = user?.id as number;
    // Perform the transaction
    const transList = await db.transaction(async (transaction) => {
      // Check for existing members
      const transactionList = await transaction
        .select()
        .from(transactions)
        .where(eq(transactions.memberId, userId))
        .limit(10)
        .offset(offset);
      return transactionList;
    });
    return transList;
  } catch (error) {
    console.error("Error updating profile", error);
    throw error;
  }
}

export async function fetchPaginatedBooks(query: string): Promise<number> {
  try {
    const totalPages = await db.transaction(async (transaction) => {
      // Count the total number of books matching the query
      const bookCountResult = await transaction
        .select({ count: count() })
        .from(books)
        .where(
          or(
            like(books.title, `%${query}%`),
            like(books.isbnNo, `%${query}%`),
            like(books.publisher, `%${query}%`)
          )
        );

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
/**
 * Updates an existing book by title.
 * @param {string} title - The title of the book to update.
 * @param {iBookBase} data - The book data to update.
 * @returns {Promise<iBook | null>}
 */
export async function update(
  id: number,
  book: iBookBase
): Promise<iBook | null> {
  try {
    const existingBooks = await db
      .select()
      .from(books)
      .where(eq(books.id, id))
      .execute();
    console.log(id, "id");
    if (!existingBooks || existingBooks.length === 0) {
      console.log("---NO BOOKS FOUND---");
      return null;
    }

    const existingBook = existingBooks[0];

    let updatedBook: iBookBase & {
      availableCopies?: number;
      totalCopies?: number;
    };

    updatedBook = {
      ...existingBook,
      ...book,
    };

    await db
      .update(books)
      .set(updatedBook)
      .where(eq(books.isbnNo, existingBook.isbnNo))
      .execute();

    console.log("---BOOK UPDATED SUCCESSFULLY---");
    return { ...existingBook, ...updatedBook } as iBook;
  } catch (error) {
    console.error("Error updating book:", error);
    throw error;
  }
}

export async function deleteBook(id: number): Promise<iBookB | undefined> {
  try {
    // Check if the book exists
    const existingBooks = await db
      .select()
      .from(books)
      .where(eq(books.id, id))
      .execute();

    if (existingBooks.length === 0) {
      console.log("Book not found");
      return undefined;
    }

    // Proceed to delete the book
    const bookToDelete = existingBooks[0];
    await db.delete(books).where(eq(books.id, id)).execute();

    console.log("---BOOK DELETED SUCCESSFULLY---");
    return bookToDelete;
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
}

export async function getBookById(id: number) {
  const selectedBook = await db
    .select()
    .from(books)
    .where(eq(books.id, Number(id)));

  return selectedBook[0];
}

export async function getAllBooks(): Promise<Array<iBookB>> {
  const allBooks = await db.select().from(books);
  return allBooks;
}

export async function updateAvailableBookCopiesOnIssue(id: number) {
  try {
    const updatedbook = await db.transaction(async (transaction) => {
      // Count the total number of books matching the query
      const book = await transaction
        .select()
        .from(books)
        .where(eq(books.id, id));
      const updatedbook = await transaction
        .update(books)
        .set({ availableCopies: book[0].availableCopies - 1 })
        .where(eq(books.id, id));
      return updatedbook;
    });

    return updatedbook;
  } catch (error) {
    console.error("Database Error:", error);
    return 0; // Ensure that a valid number is returned in case of an error
  }
}
export async function updateAvailableBookCopiesOnReturn(id: number) {
  try {
    const updatedbook = await db.transaction(async (transaction) => {
      // Count the total number of books matching the query
      const book = await transaction
        .select()
        .from(books)
        .where(eq(books.id, id));
      const updatedbook = await transaction
        .update(books)
        .set({ availableCopies: book[0].availableCopies + 1 })
        .where(eq(books.id, id));
      return updatedbook;
    });

    return updatedbook;
  } catch (error) {
    console.error("Database Error:", error);
    return 0; // Ensure that a valid number is returned in case of an error
  }
}

export async function getDistinctGenres() {
  try {
    // Query to get distinct genres from the books table
    const genres = await db.selectDistinct({ genre: books.genre }).from(books);
    const genre = genres.map((genre) => genre.genre);
    return genre;
  } catch (error) {
    console.error("Error fetching genres:", error);
    throw new Error("Could not fetch genres");
  }
}
