import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "/root/inMemory/Library_app/library/drizzle/schema.ts",
  out: "./src/drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.POSTGRES_URL ??
      (() => {
        throw new Error("DATABASE_URL is not set");
      })(), // throw an error if undefined
  },
});
