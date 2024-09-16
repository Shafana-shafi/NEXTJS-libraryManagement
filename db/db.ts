import mysql2 from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { AppEnvs } from "../read-env";
const poolConnection = mysql2.createPool({
  uri: AppEnvs.DATABASE_URL,
});
const db = drizzle(poolConnection);
module.exports = db;
