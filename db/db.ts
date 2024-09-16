import mysql2 from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
const poolConnection = mysql2.createPool({
  uri: process.env.DATABASE_URL,
});
const db = drizzle(poolConnection);
module.exports = db;
