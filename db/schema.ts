import {
  date,
  integer,
  pgTable,
  serial,
  varchar,
  uniqueIndex,
  real,
} from "drizzle-orm/pg-core";

export const books = pgTable(
  "books",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 100 }).notNull(),
    author: varchar("author", { length: 150 }).notNull(),
    publisher: varchar("publisher", { length: 100 }).notNull(),
    genre: varchar("genre", { length: 31 }).notNull(),
    isbnNo: varchar("isbnNo", { length: 13 }).notNull(),
    pages: integer("pages").notNull(),
    totalCopies: integer("totalCopies").notNull(),
    availableCopies: integer("availableCopies").notNull(),
    price: real("price").notNull(),
  },
  (table) => {
    return {
      idIdx: uniqueIndex("books_id_idx").on(table.id),
    };
  }
);

export const members = pgTable(
  "members",
  {
    id: serial("id").primaryKey(),
    firstName: varchar("firstName", { length: 255 }).notNull(),
    lastName: varchar("lastName", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phoneNumber: varchar("phoneNumber", { length: 10 }),
    address: varchar("address", { length: 255 }),
    membershipStatus: varchar("membershipStatus", { length: 10 }).notNull(),
    password: varchar("password", { length: 255 }),
    role: varchar("role", { length: 10 }).notNull(),
  },
  (table) => {
    return {
      idIdx: uniqueIndex("members_id_idx").on(table.id),
      emailIdx: uniqueIndex("members_email_idx").on(table.email),
    };
  }
);

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  memberId: integer("memberid")
    .notNull()
    .references(() => members.id),
  bookId: integer("bookid")
    .notNull()
    .references(() => books.id),
  borrowDate: date("borrowDate").notNull(),
  returnDate: date("returnDate"),
  dueDate: date("dueDate").notNull(),
});

export const refreshTokens = pgTable("refresh_token", {
  id: serial("id").primaryKey(),
  memberId: integer("memberId")
    .notNull()
    .references(() => members.id),
  refreshToken: varchar("refreshToken", { length: 255 }).notNull(),
  createdAt: varchar("createdAt", { length: 255 }).notNull(),
  expiresAt: varchar("expiresAt", { length: 255 }).notNull(),
});

export const requests = pgTable(
  "requests",
  {
    id: serial("id").primaryKey(),
    memberId: integer("memberId")
      .notNull()
      .references(() => members.id),
    bookId: integer("bookid")
      .notNull()
      .references(() => books.id),
    requestDate: date("requestDate").notNull(),
    status: varchar("status", { length: 255 }).notNull(),
    issuedDate: date("issuedDate"),
    returnDate: date("returnDate"),
  },
  (table) => {
    return {
      idIdx: uniqueIndex("requests_id_idx").on(table.id),
    };
  }
);
