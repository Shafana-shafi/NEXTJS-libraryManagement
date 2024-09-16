import {
  date,
  int,
  mysqlTable,
  serial,
  varchar,
  bigint,
  float,
} from "drizzle-orm/mysql-core";

export const books = mysqlTable("books", {
  id: serial("id").unique().autoincrement(),
  title: varchar("title", { length: 100 }).notNull(),
  author: varchar("author", { length: 150 }).notNull(),
  publisher: varchar("publisher", { length: 100 }).notNull(),
  genre: varchar("genre", { length: 31 }).notNull(),
  isbnNo: varchar("isbnNo", { length: 13 }).notNull(),
  pages: int("pages").notNull(),
  totalCopies: int("totalCopies").notNull(),
  availableCopies: int("availableCopies").notNull(),
  price: float("price").notNull(),
});

export const members = mysqlTable("members", {
  id: serial("id").unique().autoincrement(),
  firstName: varchar("firstName", { length: 255 }).notNull(),
  lastName: varchar("lastName", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  phoneNumber: varchar("phoneNumber", { length: 10 }),
  address: varchar("address", { length: 255 }),
  membershipStatus: varchar("membershipStatus", { length: 10 }).notNull(),
  password: varchar("password", { length: 255 }),
  role: varchar("role", { length: 10 }).notNull(),
});

export const transactions = mysqlTable("transactions", {
  id: serial("id").autoincrement(),
  memberId: int("memberid")
    .notNull()
    .references(() => members.id),
  bookId: int("bookid")
    .notNull()
    .references(() => books.id),
  borrowDate: date("borrowDate").notNull(),
  returnDate: date("returnDate"),
  dueDate: date("dueDate").notNull(),
});

export const refreshTokens = mysqlTable("refresh_token", {
  id: serial("id").autoincrement(),
  memberId: int("memberId")
    .notNull()
    .references(() => members.id),
  refreshToken: varchar("refreshToken", { length: 255 }).notNull(),
  createdAt: varchar("createdAt", { length: 255 }).notNull(),
  expiresAt: varchar("expiresAt", { length: 255 }).notNull(),
});

export const requests = mysqlTable("requests", {
  id: serial("id").unique().autoincrement(),
  memberId: int("memberId")
    .notNull()
    .references(() => members.id),
  bookId: int("bookid")
    .notNull()
    .references(() => books.id),
  requestDate: date("requestDate").notNull(),
  status: varchar("status", { length: 255 }).notNull(),
  issuedDate: date("issuedDate"),
  returnDate: date("returnDate"),
});
