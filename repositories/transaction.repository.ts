"use server";
import { iTransactionBase } from "@/models/transactionmodel";
import { eq, and, or, like, isNotNull } from "drizzle-orm";
import chalk from "chalk";
import { MySql2Database } from "drizzle-orm/mysql2";
import { members, books, transactions } from "@/db/schema";
import mysql2 from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { AppEnvs } from "@/read-env";

const poolConnection = mysql2.createPool({
  uri: process.env.DATABASE_URL,
});
const db = drizzle(poolConnection);

export async function create(atransaction: iTransactionBase) {
  console.log(atransaction);
  const borrowDate = new Date();
  const dueDate = new Date(borrowDate);
  dueDate.setDate(borrowDate.getDate() + 14);

  try {
    const result = await db.transaction(async (transaction) => {
      const existingMember = await transaction
        .select()
        .from(members)
        .where(eq(members.id, atransaction.memberId))
        .execute();

      if (!existingMember || existingMember.length === 0) {
        console.log(chalk.red("MEMBER DOES NOT EXIST"));
        return;
      }

      console.log(existingMember);

      const existingBook = await transaction
        .select()
        .from(books)
        .where(eq(books.id, atransaction.bookId))
        .execute();

      if (!existingBook || existingBook.length === 0) {
        console.log(chalk.red("BOOK DOES NOT EXIST"));
        return;
      }

      const availableCopies = existingBook[0].availableCopies;
      if (
        availableCopies === undefined ||
        availableCopies === null ||
        availableCopies <= 0
      ) {
        console.log(chalk.red("NO AVAILABLE COPIES"));
        return;
      }

      const newTransaction = {
        ...atransaction,
        returnDate: null,
        dueDate: dueDate,
        borrowDate: borrowDate,
      };

      console.log(newTransaction);

      await transaction.insert(transactions).values(newTransaction).execute();

      return newTransaction;
    });
  } catch (error) {
    console.error(error);
  }
}

export async function returnBook(transaction: iTransactionBase) {
  const returnDate = new Date();

  try {
    const result = await db.transaction(async (transactionConn) => {
      // Check if the transaction exists for the given memberId and bookId
      const existingTransaction = await transactionConn
        .select({
          borrowDate: transactions.borrowDate,
          dueDate: transactions.dueDate,
          id: transactions.id,
        })
        .from(transactions)
        .where(
          and(
            eq(transactions.memberId, transaction.memberId),
            eq(transactions.bookId, transaction.bookId)
          )
        )
        .execute();

      if (!existingTransaction || existingTransaction.length === 0) {
        console.log(chalk.red("TRANSACTION NOT FOUND"));
        return;
      }

      const transactionId = existingTransaction[0].id;
      const borrowDate = existingTransaction[0].borrowDate;
      const dueDate = existingTransaction[0].dueDate;

      // Update the transaction with the return date
      await transactionConn
        .update(transactions)
        .set({ returnDate })
        .where(
          and(
            eq(transactions.memberId, transaction.memberId),
            eq(transactions.bookId, transaction.bookId)
          )
        )
        .execute();

      // Update the available number of copies
      const book = await transactionConn
        .select({ availableCopies: books.availableCopies })
        .from(books)
        .where(eq(books.id, transaction.bookId))
        .execute();

      if (!book || book.length === 0) {
        console.log(chalk.red("BOOK NOT FOUND"));
        return;
      }

      const availableCopies = book[0].availableCopies;

      await transactionConn
        .update(books)
        .set({ availableCopies: availableCopies + 1 })
        .where(eq(books.id, transaction.bookId))
        .execute();

      console.log(chalk.green("BOOK RETURNED SUCCESSFULLY"));
      return {
        ...transaction,
        borrowDate: borrowDate,
        dueDate: dueDate,
        returnDate: returnDate,
      };
    });
  } catch (error) {
    console.error(error);
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
            eq(transactions.memberId, memberId), // Filter by the given memberId
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
