"use server";
import mysql2 from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/authOptions";
import { books, members, requests, transactions } from "@/db/schema";
import { eq, and, like, or, count, isNotNull, sql, inArray } from "drizzle-orm";
import chalk from "chalk";
import { iBook, iBookB, iBookBase } from "@/models/book.model";
import { iRequest, iRequestBase } from "@/models/request.model";
import { MySqlSelect } from "drizzle-orm/mysql-core";

const poolConnection = mysql2.createPool({
  uri: process.env.DATABASE_URL,
});
const db = drizzle(poolConnection);

/**
 * Creates a new request or updates an existing one if it already exists.
 * @param {iRequestBase} request - The request data to create.
 * @returns {Promise<iRequest | undefined>}
 */
export async function createRequest(
  request: iRequestBase
): Promise<iRequest | undefined> {
  try {
    // Handle null values for issuedDate
    const requestToInsert = {
      ...request,
      issuedDate: request.issuedDate ?? null, // Convert null to undefined
    };

    await db.insert(requests).values(requestToInsert).execute();

    console.log(chalk.green("Request added successfully\n"));
    return requestToInsert as iRequest;
  } catch (error) {
    console.error("Error creating request:", error);
    throw error;
  }
}

export async function fetchAllRequests(
  query: string,
  currentPage: number,
  filters: {
    status?: string[];
    requestDate?: Date;
    issuedDate?: Date;
    returnedDate?: Date;
    requestDateRange?: string;
    issuedDateRange?: string;
    returnedDateRange?: string;
  }
) {
  const offset = (currentPage - 1) * 6;
  const limit = 6;

  try {
    let baseQuery: MySqlSelect = db.select().from(requests).$dynamic();

    const conditions = [
      or(
        like(requests.memberId, `%${query}%`),
        like(requests.bookId, `%${query}%`),
        like(requests.requestDate, `%${query}%`),
        like(requests.issuedDate, `%${query}%`),
        like(requests.returnDate, `%${query}%`),
        like(requests.status, `%${query}%`)
      ),
    ];

    // Apply status filter
    if (filters.status && filters.status.length > 0) {
      conditions.push(inArray(requests.status, filters.status));
    }

    // Apply date filters
    if (filters.requestDate) {
      conditions.push(eq(requests.requestDate, filters.requestDate));
    }
    if (filters.issuedDate) {
      conditions.push(eq(requests.issuedDate, filters.issuedDate));
    }
    if (filters.returnedDate) {
      conditions.push(eq(requests.returnDate, filters.returnedDate));
    }

    // Apply date range filters
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    if (filters.requestDateRange) {
      switch (filters.requestDateRange) {
        case "today":
          conditions.push(sql`DATE(${requests.requestDate}) = DATE(${today})`);
          break;
        case "yesterday":
          conditions.push(
            sql`DATE(${requests.requestDate}) = DATE(${yesterday})`
          );
          break;
        case "past_week":
          conditions.push(sql`${requests.requestDate} >= ${lastWeek}`);
          break;
      }
    }

    if (filters.issuedDateRange) {
      switch (filters.issuedDateRange) {
        case "today":
          conditions.push(sql`DATE(${requests.issuedDate}) = DATE(${today})`);
          break;
        case "yesterday":
          conditions.push(
            sql`DATE(${requests.issuedDate}) = DATE(${yesterday})`
          );
          break;
        case "past_week":
          conditions.push(sql`${requests.issuedDate} >= ${lastWeek}`);
          break;
      }
    }

    if (filters.returnedDateRange) {
      switch (filters.returnedDateRange) {
        case "today":
          conditions.push(sql`DATE(${requests.returnDate}) = DATE(${today})`);
          break;
        case "yesterday":
          conditions.push(
            sql`DATE(${requests.returnDate}) = DATE(${yesterday})`
          );
          break;
        case "past_week":
          conditions.push(sql`${requests.returnDate} >= ${lastWeek}`);
          break;
      }
    }

    baseQuery = baseQuery.where(and(...conditions));

    const allRequests = await baseQuery
      .limit(limit)
      .offset(offset)
      .orderBy(requests.status);

    return allRequests;
  } catch (error) {
    console.error("Error fetching requests:", error);
    throw error;
  }
}

export async function fetchFilteredUserRequests(
  memberId: number,
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * 6;
  try {
    const allRequests = await db.transaction(async (transaction) => {
      // Perform the search and pagination
      const filteredRequests = await transaction
        .select()
        .from(requests)
        .where(
          and(
            eq(requests.memberId, memberId),
            or(
              like(requests.memberId, `%${query}%`),
              like(requests.bookId, `%${query}%`),
              like(requests.requestDate, `%${query}%`)
            )
          )
        )
        .limit(6)
        .offset(offset);
      return filteredRequests;
    });
    return allRequests;
  } catch (error) {
    console.error("Error fetching user requests:", error);
    throw new Error("Failed to fetch user requests.");
  }
}

export async function updateRequestStatus(
  memberId: number,
  bookId: number,
  status: string,
  issuedDate: Date | null,
  returnDate: Date | null
) {
  try {
    const allRequests = await db
      .update(requests)
      .set({ status: status, issuedDate: issuedDate, returnDate: returnDate })
      .where(and(eq(requests.memberId, memberId), eq(requests.bookId, bookId)));
    return allRequests;
  } catch (error) {
    console.error("Error creating request:", error);
    throw error;
  }
}

export async function fetchFilteredTransactions(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * 6;

  try {
    // Perform the transaction
    const transList = await db.transaction(async (transaction) => {
      // Query transactions joined with members and books
      const transactionList = await transaction
        .select({
          id: requests.id,
          issuedDate: requests.issuedDate,
          returnDate: requests.returnDate,
          memberFirstName: members.firstName,
          memberLastName: members.lastName,
          bookTitle: books.title,
        })
        .from(requests)
        .innerJoin(members, eq(requests.memberId, members.id))
        .innerJoin(books, eq(requests.bookId, books.id))
        .where(
          and(
            or(
              like(members.firstName, `%${query}%`),
              like(members.lastName, `%${query}%`),
              like(books.title, `%${query}%`)
            ),
            // Add null checks for memberId and bookId
            isNotNull(requests.memberId),
            isNotNull(requests.bookId)
          )
        )
        .limit(6)
        .offset(offset);

      return transactionList;
    });

    return transList;
  } catch (error) {
    console.error("Error fetching filtered transactions", error);
    throw error;
  }
}

export async function getAllTransactionsByMember(
  memberId: number,
  query: string = "", // Optional query for filtering
  currentPage: number = 1 // Pagination support
) {
  const offset = (currentPage - 1) * 6;

  try {
    // Perform the transaction
    const transactionList = await db.transaction(async (transaction) => {
      // Query transactions joined with members and books
      const transactionsList = await transaction
        .select({
          id: requests.id,
          issuedDate: requests.issuedDate,
          returnDate: requests.returnDate,
          memberFirstName: members.firstName,
          memberLastName: members.lastName,
          bookTitle: books.title,
        })
        .from(requests)
        .innerJoin(members, eq(requests.memberId, members.id))
        .innerJoin(books, eq(requests.bookId, books.id))
        .where(
          and(
            eq(requests.memberId, memberId), // Filter by the given memberId
            or(
              like(members.firstName, `%${query}%`),
              like(members.lastName, `%${query}%`),
              like(books.title, `%${query}%`)
            ),
            // Add null checks for memberId and bookId
            isNotNull(requests.memberId),
            isNotNull(requests.bookId)
          )
        )
        .limit(6)
        .offset(offset);

      return transactionsList;
    });

    if (!transactionList || transactionList.length === 0) {
      console.log(chalk.red("NO TRANSACTIONS FOUND FOR MEMBER"));
      return [];
    }

    return transactionList;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}

export async function updateRequestStatusOnReturn(
  memberId: number,
  bookId: number,
  status: string,
  returnDate: Date
) {
  try {
    const allRequests = await db
      .update(requests)
      .set({ status: status, returnDate: returnDate })
      .where(and(eq(requests.memberId, memberId), eq(requests.bookId, bookId)));
    return allRequests;
  } catch (error) {
    console.error("Error creating request:", error);
    throw error;
  }
}

export async function fetchPaginatedRequest(query: string): Promise<number> {
  try {
    const totalPages = await db.transaction(async (transaction) => {
      // Count the total number of books matching the query
      const bookCountResult = await transaction
        .select({ count: count() })
        .from(requests)
        .where(
          or(
            like(requests.memberId, `%${query}%`),
            like(requests.bookId, `%${query}%`),
            like(requests.requestDate, `%${query}%`),
            like(requests.returnDate, `%${query}%`),
            like(requests.issuedDate, `%${query}%`),
            like(requests.status, `%${query}%`)
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
      const totalPages = Math.ceil(totalBooks / 6);

      return totalPages;
    });

    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    return 0; // Ensure that a valid number is returned in case of an error
  }
}
