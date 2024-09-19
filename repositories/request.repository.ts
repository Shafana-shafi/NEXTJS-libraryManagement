import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/authOptions";
import { books, members, requests, transactions } from "@/db/schema";
import {
  eq,
  and,
  or,
  count,
  isNotNull,
  inArray,
  ilike,
  asc,
  like,
} from "drizzle-orm";
import chalk from "chalk";
import { iBook, iBookB, iBookBase } from "@/models/book.model";
import { iRequest, iRequestBase } from "@/models/request.model";
import { PgSelect } from "drizzle-orm/pg-core";
import * as schema from "../db/schema";

export const db = drizzle(sql, { schema });
console.log("hi");
/**
 * Creates a new request or updates an existing one if it already exists.
 * @param {iRequestBase} request - The request data to create.
 * @returns {Promise<iRequest | undefined>}
 */
export async function createRequest(request: iRequestBase) {
  try {
    // Convert Date objects to ISO strings
    const requestToInsert = {
      ...request,
      requestDate: request.requestDate.toISOString(),
      issuedDate: request.issuedDate ? request.issuedDate.toISOString() : null,
      returnDate: request.returnDate ? request.returnDate.toISOString() : null,
    };

    const result = await db.insert(requests).values(requestToInsert).execute();

    console.log(chalk.green("Request added successfully\n"));
    return result;
  } catch (error) {
    console.error("Error creating request:", error);
    throw error;
  }
}

type FilteredRequest = {
  id: number;
  memberId: number;
  bookId: number;
  requestDate: Date;
  status: string;
  issuedDate: Date | null;
  returnDate: Date | null;
  memberFirstName: string;
  memberLastName: string;
  bookTitle: string;
};

// export async function fetchAllRequests(
//   query: string,
//   currentPage: number,
//   filters: {
//     status?: string[];
//     requestDate?: Date;
//     issuedDate?: Date;
//     returnedDate?: Date;
//     requestDateRange?: string;
//     issuedDateRange?: string;
//     returnedDateRange?: string;
//   }
// ) {
//   const offset = (currentPage - 1) * 6;
//   const limit = 6;
//   console.log(filters.returnedDate?.toString());
//   try {
//     let baseQuery = db
//       .select({
//         id: requests.id,
//         memberId: requests.memberId,
//         bookId: requests.bookId,
//         requestDate: requests.requestDate,
//         issuedDate: requests.issuedDate,
//         returnDate: requests.returnDate,
//         status: requests.status,
//         memberFirstName: members.firstName,
//         memberLastName: members.lastName,
//         bookTitle: books.title,
//       })
//       .from(requests)
//       .innerJoin(members, eq(requests.memberId, members.id))
//       .innerJoin(books, eq(requests.bookId, books.id))
//       .$dynamic();

//     const conditions = [
//       or(
//         ilike(members.firstName, `%${query}%`),
//         ilike(members.lastName, `%${query}%`),
//         ilike(books.title, `%${query}%`),
//         ilike(requests.bookId, `%${query}%`),
//         ilike(requests.requestDate, `%${query}%`),
//         ilike(requests.issuedDate ?? "", `%${query}%`),
//         ilike(requests.returnDate ?? "", `%${query}%`),
//         ilike(requests.status, `%${query}%`)
//       ),
//     ];

//     if (filters.status && filters.status.length > 0) {
//       conditions.push(inArray(requests.status, filters.status));
//     }

//     if (filters.requestDate) {
//       conditions.push(
//         eq(requests.requestDate, filters.requestDate.toISOString())
//       );
//     }
//     if (filters.issuedDate) {
//       conditions.push(
//         eq(requests.issuedDate, filters.issuedDate.toISOString())
//       );
//     }
//     if (filters.returnedDate) {
//       conditions.push(
//         eq(requests.returnDate, filters.returnedDate.toISOString())
//       );
//     }

//     const today = new Date();
//     const yesterday = new Date(today);
//     yesterday.setDate(yesterday.getDate() - 1);
//     const lastWeek = new Date(today);
//     lastWeek.setDate(lastWeek.getDate() - 7);

//     // if (filters.requestDateRange) {
//     //   switch (filters.requestDateRange) {
//     //     case "today":
//     //       conditions.push(sql`DATE(${requests.requestDate}) = DATE(${today})`);
//     //       break;
//     //     case "yesterday":
//     //       conditions.push(sql`DATE(${requests.requestDate}) = DATE(${yesterday})`);
//     //       break;
//     //     case "past_week":
//     //       conditions.push(sql`${requests.requestDate} >= ${lastWeek}`);
//     //       break;
//     //   }
//     // }

//     // if (filters.issuedDateRange) {
//     //   switch (filters.issuedDateRange) {
//     //     case "today":
//     //       conditions.push(sql`DATE(${requests.issuedDate}) = DATE(${today})`);
//     //       break;
//     //     case "yesterday":
//     //       conditions.push(sql`DATE(${requests.issuedDate}) = DATE(${yesterday})`);
//     //       break;
//     //     case "past_week":
//     //       conditions.push(sql`${requests.issuedDate} >= ${lastWeek}`);
//     //       break;
//     //   }
//     // }

//     // if (filters.returnedDateRange) {
//     //   switch (filters.returnedDateRange) {
//     //     case "today":
//     //       conditions.push(sql`DATE(${requests.returnDate}) = DATE(${today})`);
//     //       break;
//     //     case "yesterday":
//     //       conditions.push(sql`DATE(${requests.returnDate}) = DATE(${yesterday})`);
//     //       break;
//     //     case "past_week":
//     //       conditions.push(sql`${requests.returnDate} >= ${lastWeek}`);
//     //       break;
//     //   }
//     // }

//     baseQuery = baseQuery.where(and(...conditions));

//     const allRequests = await baseQuery.limit(limit).offset(offset)
//       .orderBy(sql`CASE
//         WHEN ${requests.status} = 'requested' THEN 1
//         WHEN ${requests.status} = 'success' THEN 2
//         WHEN ${requests.status} = 'declined' THEN 3
//         WHEN ${requests.status} = 'returned' THEN 4
//         ELSE 5
//       END`);

//     return allRequests as FilteredRequest[];
//   } catch (error) {
//     console.error("Error fetching requests:", error);
//     throw error;
//   }
// }

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
): Promise<FilteredRequest[]> {
  const offset = (currentPage - 1) * 6;
  const limit = 6;

  try {
    let baseQuery = db
      .select({
        id: requests.id,
        memberId: requests.memberId,
        bookId: requests.bookId,
        requestDate: requests.requestDate,
        issuedDate: requests.issuedDate,
        returnDate: requests.returnDate,
        status: requests.status,
        memberFirstName: members.firstName,
        memberLastName: members.lastName,
        bookTitle: books.title,
      })
      .from(requests)
      .innerJoin(members, eq(requests.memberId, members.id))
      .innerJoin(books, eq(requests.bookId, books.id))
      .$dynamic();

    const conditions = [
      or(
        ilike(members.firstName, `%${query}%`),
        ilike(members.lastName, `%${query}%`),
        ilike(books.title, `%${query}%`),
        // like(requests.bookId, `%${query}%`),
        // like(requests.requestDate, `%${query}%`),
        // like(requests.issuedDate, `%${query}%`),
        // like(requests.returnDate, `%${query}%`),
        ilike(requests.status, `%${query}%`)
      ),
    ];

    if (filters.status && filters.status.length > 0) {
      conditions.push(inArray(requests.status, filters.status));
    }

    // if (filters.requestDate) {
    //   conditions.push(
    //     eq(requests.requestDate, filters.requestDate.toISOString())
    //   );
    // }
    // if (filters.issuedDate) {
    //   conditions.push(
    //     eq(requests.issuedDate, filters.issuedDate.toDateString())
    //   );
    // }
    // if (filters.returnedDate) {
    //   conditions.push(
    //     eq(requests.returnDate, filters.returnedDate.toDateString())
    //   );
    // }

    baseQuery = baseQuery.where(and(...conditions));

    const allRequests = await baseQuery
      .where(and(...conditions))
      // .orderBy(
      //   sql`CASE
      //     WHEN ${requests.status} = 'requested' THEN 1
      //     WHEN ${requests.status} = 'success' THEN 2
      //     WHEN ${requests.status} = 'declined' THEN 3
      //     WHEN ${requests.status} = 'returned' THEN 4
      //     ELSE 5
      //   END`
      //   asc(requests.requestDate)
      //)
      .limit(limit)
      .offset(offset);

    return allRequests.map((request) => ({
      ...request,
      requestDate: new Date(request.requestDate),
      issuedDate: request.issuedDate ? new Date(request.issuedDate) : null,
      returnDate: request.returnDate ? new Date(request.returnDate) : null,
    }));
  } catch (error) {
    console.error("Error fetching requests:", error);
    throw error;
  }
}

export async function fetchFilteredUserRequests(
  memberId: number,
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

  try {
    const allRequests = await db.transaction(async (transaction) => {
      let baseQuery = transaction
        .select({
          id: requests.id,
          memberId: requests.memberId,
          bookId: requests.bookId,
          requestDate: requests.requestDate,
          issuedDate: requests.issuedDate,
          returnDate: requests.returnDate,
          status: requests.status,
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
              ilike(members.firstName, `%${query}%`),
              ilike(members.lastName, `%${query}%`),
              ilike(books.title, `%${query}%`),
              ilike(requests.status, `%${query}%`)
            ),
            eq(requests.memberId, memberId)
          )
        );

      // Build conditions
      // const conditions = [
      //   eq(requests.memberId, memberId),
      //   or(
      //     ilike(members.firstName, `%${query}%`),
      //     ilike(members.lastName, `%${query}%`),
      //     ilike(books.title, `%${query}%`),
      //     ilike(requests.status, `%${query}%`)
      //   ),
      // ];

      // if (filters.status && filters.status.length > 0) {
      //   conditions.push(inArray(requests.status, filters.status));
      // }

      // if (filters.requestDate) {
      //   conditions.push(
      //     ilike(requests.requestDate, filters.requestDate.toString())
      //   );
      // }

      // if (filters.issuedDate) {
      //   conditions.push(
      //     ilike(requests.issuedDate, filters.issuedDate.toISOString())
      //   );
      // }

      // if (filters.returnedDate) {
      //   conditions.push(
      //     ilike(requests.returnDate, filters.returnedDate.toISOString())
      //   );
      // }
      // console.log(conditions, "conditions");
      // baseQuery = baseQuery.where(and(...conditions));

      const paginatedRequests = await baseQuery
        .orderBy(asc(requests.requestDate))
        .limit(6)
        .offset(offset);

      return paginatedRequests.map((request) => ({
        ...request,
        requestDate: new Date(request.requestDate),
        issuedDate: request.issuedDate ? new Date(request.issuedDate) : null,
        returnDate: request.returnDate ? new Date(request.returnDate) : null,
      }));
    });
    console.log(allRequests, "all requests");
    return allRequests;
  } catch (error) {
    console.error("Error fetching requests:", error);
    throw error;
  }
}

export async function updateRequestStatus(
  memberId: number,
  bookId: number,
  status: string,
  issuedDate: Date | null,
  returnDate: Date | null,
  requestId: number
) {
  try {
    const allRequests = await db
      .update(requests)
      .set({
        status: status,
        issuedDate: issuedDate?.toISOString(),
        returnDate: returnDate?.toISOString(),
      })
      .where(
        and(
          eq(requests.memberId, memberId),
          eq(requests.bookId, bookId),
          eq(requests.id, requestId)
        )
      );
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
    const transList = await db.transaction(async (transaction) => {
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
              ilike(members.firstName, `%${query}%`),
              ilike(members.lastName, `%${query}%`),
              ilike(books.title, `%${query}%`)
            ),
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
  query: string = "",
  currentPage: number = 1
) {
  const offset = (currentPage - 1) * 6;

  try {
    const transactionList = await db.transaction(async (transaction) => {
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
            eq(requests.memberId, memberId),
            or(
              ilike(members.firstName, `%${query}%`),
              ilike(members.lastName, `%${query}%`),
              ilike(books.title, `%${query}%`)
            ),
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
  returnDate: Date,
  requestId: number
) {
  try {
    const allRequests = await db
      .update(requests)
      .set({ status: status, returnDate: returnDate.toISOString() })
      .where(
        and(
          eq(requests.memberId, memberId),
          eq(requests.bookId, bookId),
          eq(requests.id, requestId)
        )
      );
    return allRequests;
  } catch (error) {
    console.error("Error creating request:", error);
    throw error;
  }
}

export async function fetchPaginatedRequest(query: string): Promise<number> {
  try {
    const totalPages = await db.transaction(async (transaction) => {
      const bookCountResult = await transaction
        .select({ count: count() })
        .from(requests)
        .where(
          or(
            // ilike(requests.memberId, `%${query}%`),
            // ilike(requests.bookId, `%${query}%`),
            // ilike(requests.requestDate, `%${query}%`),
            // ilike(requests.returnDate ?? "", `%${query}%`),
            // ilike(requests.issuedDate ?? "", `%${query}%`),
            ilike(requests.status, `%${query}%`)
          )
        );

      const bookCount = bookCountResult[0]?.count || 0;
      const totalBooks = Number(bookCount);

      if (isNaN(totalBooks)) {
        console.error("Invalid book count:", bookCount);
        return 0;
      }

      const totalPages = Math.ceil(totalBooks / 6);

      return totalPages;
    });

    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw error;
  }
}
