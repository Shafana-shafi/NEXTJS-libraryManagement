import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "/root/inMemory/Library_app/library/db/schema.ts",
  out: "./src/drizzle/migrations",
  dialect: "mysql",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      (() => {
        throw new Error("DATABASE_URL is not set");
      })(), // throw an error if undefined
  },
  verbose: true,
  strict: true,
});
