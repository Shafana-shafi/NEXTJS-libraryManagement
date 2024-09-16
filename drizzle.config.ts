import { defineConfig } from "drizzle-kit";
import { AppEnvs } from "./read-env";
export default defineConfig({
  schema: "/root/inMemory/Library_app/library/db/schema.ts",
  out: "./src/drizzle/migrations",
  dialect: "mysql",
  dbCredentials: {
    url: AppEnvs.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
